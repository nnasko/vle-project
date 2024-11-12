"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, BookOpen, School } from "lucide-react";
import { getDepartment } from "@/services/departmentApi";
import { Department } from "@/types/department";
import StatCard from "./StatCard";
import StaffTab from "./StaffTab";
import ModulesTab from "./ModulesTab";
import OverviewTab from "./OverviewTab";
import CohortsTab from "./CohortsTab";

const DepartmentDetail: React.FC = () => {
  const params = useParams();
  const departmentId = params.id as string;

  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffSearch, setStaffSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchDepartmentData = useCallback(async () => {
    try {
      const data = await getDepartment(departmentId);
      setDepartment(data);
    } catch (error) {
      toast.error("Failed to fetch department data");
    } finally {
      setIsLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchDepartmentData();
  }, [fetchDepartmentData]);

  const handleTeacherAdded = useCallback(() => {
    fetchDepartmentData();
  }, [fetchDepartmentData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Department not found</h2>
          <p className="text-gray-500">
            The requested department could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {department.name}
          </h2>
          <p className="text-gray-500">Course Code: {department.code}</p>
          <p className="text-gray-500">{department.description}</p>
          <p className="text-gray-500">
            Duration: {department.duration.replace("_", " ").toLowerCase()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Staff"
          value={department.staffCount}
          description={
            department.teachers?.length > 0
              ? `${department.teachers.length} active teachers`
              : undefined
          }
        />
        <StatCard
          icon={GraduationCap}
          label="Total Students"
          value={department.studentCount}
          description="Currently enrolled"
        />
        <StatCard
          icon={BookOpen}
          label="Active Modules"
          value={department.modules?.length || 0}
          description={
            department.modules?.filter((m) => m.status === "ACTIVE").length +
            " running"
          }
        />
        <StatCard
          icon={School}
          label="Active Cohorts"
          value={department.cohorts?.length || 0}
          description={
            department.cohorts?.filter((c) => c.isActive).length + " running"
          }
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab department={department} />
        </TabsContent>

        <TabsContent value="staff">
          <StaffTab
            department={department}
            staffSearch={staffSearch}
            setStaffSearch={setStaffSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            onTeacherAdded={handleTeacherAdded}
          />
        </TabsContent>

        <TabsContent value="modules">
          <ModulesTab department={department} />
        </TabsContent>

        <TabsContent value="cohorts">
          <CohortsTab department={department} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentDetail;
