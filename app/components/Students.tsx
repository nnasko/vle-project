"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import StudentDialog from "./StudentDialog";
import { GradeLevel } from "@prisma/client";
import { StudentLogDialog } from "./StudentLogDialong";

// Updated interfaces to match Prisma schema
interface Student {
  id: string;
  department: {
    name: string;
  };
  user: {
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    isActive: boolean;
  };
  studentId: string;
  currentGrade: GradeLevel;
  expectedGraduation: Date;
  cohort?: {
    name: string;
    department: {
      name: string;
    };
  };
  overallGrade: number | null;
  logs?: {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: Date;
    teacher: {
      user: {
        name: string;
      };
    };
  }[];
}

interface CreateStudentInput {
  name: string;
  email: string;
  phone?: string;
  currentGrade: GradeLevel;
  cohortId?: string;
  password?: string;
}

const COURSE_OPTIONS = [
  { label: "All Courses", value: "all" },
  { label: "E-Sports", value: "E-sports" },
  { label: "Web Design", value: "Web Design" },
  { label: "Data Science", value: "Data Science" },
] as const;

// StudentCard component
const StudentCard: React.FC<{
  student: Student;
  onEdit: (student: Student) => void;
}> = ({ student, onEdit }) => (
  <Card className="p-4 hover:shadow-lg transition-shadow relative bg-white">
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-neutral-200">
            <AvatarImage
              src={student.user.avatar || "/api/placeholder/32/32"}
              alt={student.user.name}
            />
            <AvatarFallback className="text-lg bg-neutral-100">
              {student.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg text-gray-900">
              {student.user.name}
            </div>
            <div className="text-sm text-gray-500">
              {student.cohort?.name || "No Course Assigned"}
            </div>
            <div className="text-sm text-gray-400">{student.studentId}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <StudentLogDialog
            student={student}
            trigger={
              <Button variant="outline" size="sm" className="h-9 px-3">
                Add Log
              </Button>
            }
          />
          <StudentDialog
            mode="edit"
            student={student}
            onSubmit={onEdit}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="bg-main text-white hover:bg-second h-9 px-3 min-w-[90px]"
              >
                Edit
              </Button>
            }
          />
        </div>
      </div>
      <div className="text-sm font-medium bg-neutral-50 p-3 rounded border border-neutral-200">
        Grade Level: {student.currentGrade.replace("_", " ")}
      </div>
      {/* Student Logs Section */}
      <div className="text-sm space-y-2">
        <div className="font-medium text-gray-900">Recent Logs</div>
        {student.logs && student.logs.length > 0 ? (
          <div className="space-y-2">
            {student.logs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="bg-neutral-50 p-3 rounded-md border border-neutral-100"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-gray-900">{log.title}</div>
                  <span className="text-xs px-2 py-1 bg-white rounded-full border border-neutral-200">
                    {log.type.charAt(0) + log.type.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">
                  By {log.teacher.user.name} •{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic py-3">No logs recorded</div>
        )}
      </div>
    </div>
  </Card>
);

// StudentRow component
interface Student {
  id: string;
  department: {
    name: string;
  };
  user: {
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    isActive: boolean;
  };
  studentId: string;
  currentGrade: GradeLevel;
  expectedGraduation: Date;
  cohort?: {
    name: string;
    department: {
      name: string;
    };
  };
  overallGrade: number | null;
  logs?: {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: Date;
    teacher: {
      user: {
        name: string;
      };
    };
  }[];
}

// StudentRow component
const StudentRow: React.FC<{
  student: Student;
  onEdit: (student: Student) => void;
}> = ({ student, onEdit }) => (
  <Card className="p-4 hover:shadow-lg transition-shadow bg-white">
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-12 w-12 border border-neutral-200">
            <AvatarImage
              src={student.user.avatar || "/api/placeholder/32/32"}
              alt={student.user.name}
            />
            <AvatarFallback className="text-lg bg-neutral-100">
              {student.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid grid-cols-4 gap-8 min-w-[600px]">
            <div>
              <div className="font-semibold text-lg text-gray-900">
                {student.user.name}
              </div>
              <div className="text-sm text-gray-400">{student.studentId}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">
                {student.cohort?.name || "No Cohort"}
              </div>
              <div className="text-sm text-gray-500">
                {student.currentGrade.replace("_", " ")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">{student.user.email}</div>
              <div className="text-sm text-gray-500">
                {student.user.phone || "No phone"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">
                Expected Graduation:{" "}
                {new Date(student.expectedGraduation).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                {student.logs?.length || 0} logs recorded
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <StudentLogDialog
            student={student}
            trigger={
              <Button variant="outline" size="sm" className="h-9 px-3">
                Add Log
              </Button>
            }
          />
          <StudentDialog
            mode="edit"
            student={student}
            onSubmit={onEdit}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="bg-main text-white hover:bg-second h-9 px-3 min-w-[90px]"
              >
                Edit
              </Button>
            }
          />
        </div>
      </div>

      {/* Logs Section for Row View */}
      {student.logs && student.logs.length > 0 && (
        <div className="border-t pt-4 mt-2">
          <div className="text-sm font-medium mb-2">Recent Logs</div>
          <div className="grid grid-cols-2 gap-4">
            {student.logs.slice(0, 2).map((log) => (
              <div
                key={log.id}
                className="bg-neutral-50 p-3 rounded-md border border-neutral-100"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-gray-900">{log.title}</div>
                  <span className="text-xs px-2 py-1 bg-white rounded-full border border-neutral-200">
                    {log.type.charAt(0) + log.type.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">
                  By {log.teacher.user.name} •{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </Card>
);

// Main Students component
const Students: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [departments, setDepartments] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);

      // Extract unique department names from students data
      const uniqueDepartments = Array.from(
        new Set(
          data
            .map((student: Student) => student.cohort?.department.name)
            .filter(Boolean)
        )
      );
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Create new student
  const handleCreateStudent = async (studentData: CreateStudentInput) => {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      await fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  // Update existing student
  const handleUpdateStudent = async (studentData: Student) => {
    try {
      const response = await fetch(`/api/students/${studentData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      await fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      student.cohort?.department.name === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: {error}</p>
        <Button
          onClick={fetchStudents}
          className="mt-4 bg-main hover:bg-second text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">MANAGE STUDENTS</h1>
            <p className="text-gray-500">Organize and manage students</p>
          </div>
          <StudentDialog mode="create" onSubmit={handleCreateStudent} />
        </div>

        <div className="bg-neutral-700 p-8 rounded-lg">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search students..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid" ? "bg-second text-white" : "text-black"
                }
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list" ? "bg-second text-white" : "text-black"
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-main" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p>No students found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onEdit={handleUpdateStudent}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onEdit={handleUpdateStudent}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
