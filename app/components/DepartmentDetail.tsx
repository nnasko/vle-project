// app/components/DepartmentDetail.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  HomeIcon,
  UserCheck,
  Mail,
  Phone,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  status: "active" | "inactive";
  staffCount: number;
  studentCount: number;
  courses: Course[];
  teachers: Teacher[];
  enrollmentTrends: EnrollmentTrend[];
  attendanceRates: AttendanceRate[];
}

interface Course {
  id: string;
  name: string;
  modules: Module[];
}

interface Teacher {
  id: string;
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  position: string;
  employeeId: string;
  teachingModules: {
    module: {
      code: string;
      name: string;
    };
  }[];
  isActive: boolean;
}

interface Module {
  id: string;
  code: string;
  name: string;
  description: string;
  year: number;
  credits: number;
  status: "active" | "review" | "archived";
  passingRate: number;
  averageScore: number;
}

interface EnrollmentTrend {
  month: string;
  students: number;
}

interface AttendanceRate {
  week: string;
  rate: number;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

interface StaffTabProps {
  department: Department;
  staffSearch: string;
  setStaffSearch: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  onTeacherAdded: () => void;
}

interface ModulesTabProps {
  department: Department;
}

interface OverviewTabProps {
  department: Department;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value }) => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-main" />
      <span className="text-sm text-gray-500">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </Card>
);

// Move component outside parent
const StaffTab: React.FC<StaffTabProps> = ({
  department,
  staffSearch,
  setStaffSearch,
  roleFilter,
  setRoleFilter,
  onTeacherAdded,
}) => {
  const filteredTeachers = department.teachers.filter((teacher) => {
    const matchesSearch =
      teacher.user.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      teacher.user.email.toLowerCase().includes(staffSearch.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      teacher.position.toLowerCase().includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Input
            placeholder="Search staff..."
            value={staffSearch}
            onChange={(e) => setStaffSearch(e.target.value)}
            className="w-64"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="head">Department Head</SelectItem>
              <SelectItem value="senior">Senior Lecturer</SelectItem>
              <SelectItem value="lecturer">Lecturer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-main hover:bg-second">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Modules</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teacher.user.avatar} />
                    <AvatarFallback>{teacher.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{teacher.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {teacher.employeeId}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{teacher.position}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-4 w-4" /> {teacher.user.email}
                  </div>
                  {teacher.user.phone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-4 w-4" /> {teacher.user.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {teacher.teachingModules.map((tm, index) => (
                    <Badge key={index} variant="secondary">
                      {tm.module.code}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className="bg-main text-white"
                  variant={teacher.isActive ? "default" : "secondary"}
                >
                  {teacher.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Move ModulesTab component outside
const ModulesTab: React.FC<ModulesTabProps> = ({ department }) => {
  const [moduleSearch, setModuleSearch] = useState("");
  const [moduleYearFilter, setModuleYearFilter] = useState("all");
  const [moduleStatusFilter, setModuleStatusFilter] = useState("all");

  const allModules = department.courses.flatMap((course) => course.modules);
  const filteredModules = allModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      module.code.toLowerCase().includes(moduleSearch.toLowerCase());
    const matchesYear =
      moduleYearFilter === "all" || module.year.toString() === moduleYearFilter;
    const matchesStatus =
      moduleStatusFilter === "all" || module.status === moduleStatusFilter;
    return matchesSearch && matchesYear && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Search modules..."
            value={moduleSearch}
            onChange={(e) => setModuleSearch(e.target.value)}
            className="w-64"
          />
          <Select value={moduleYearFilter} onValueChange={setModuleYearFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={moduleStatusFilter}
            onValueChange={setModuleStatusFilter}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-main hover:bg-second">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="space-y-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="p-4">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">
                    {module.code}: {module.name}
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    Year {module.year} • {module.credits} Credits
                  </div>
                </div>
                <Badge
                  variant={module.status === "active" ? "default" : "secondary"}
                  className="bg-main text-white"
                >
                  {module.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{module.description}</p>
              <div className="mt-4 flex gap-4">
                <div className="text-sm text-gray-500">
                  Passing Rate: {module.passingRate}%
                </div>
                <div className="text-sm text-gray-500">
                  Average Score: {module.averageScore}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Move OverviewTab component outside
const OverviewTab: React.FC<OverviewTabProps> = ({ department }) => (
  <div className="space-y-4">
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Enrollment Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={department.enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#473BF0"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    <Card className="p-4">
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={department.courses.map((course) => ({
                name: course.name,
                passingRate:
                  course.modules.reduce(
                    (acc: number, module: Module) => acc + module.passingRate,
                    0
                  ) / course.modules.length,
                averageScore:
                  course.modules.reduce(
                    (acc: number, module: Module) => acc + module.averageScore,
                    0
                  ) / course.modules.length,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="passingRate" name="Passing Rate %" fill="#473BF0" />
              <Bar dataKey="averageScore" name="Average Score" fill="#6665DD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    {/* Statistics Cards */}
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Staff Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              department.teachers.reduce(
                (acc: Record<string, number>, teacher: Teacher) => {
                  acc[teacher.position] = (acc[teacher.position] || 0) + 1;
                  return acc;
                },
                {}
              )
            ).map(([position, count]) => (
              <div key={position} className="flex justify-between items-center">
                <span>{position}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {department.courses.map((course: Course) => (
              <div
                key={course.id}
                className="flex justify-between items-center"
              >
                <span>{course.name}</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {course.modules.length} modules
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
