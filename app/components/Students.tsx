"use client";
import React, { useState } from "react";
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
import { LayoutGrid, List } from "lucide-react";
import StudentDialog from "./StudentDialog";
import { GradeLevel, AttendanceStatus } from "@prisma/client";

// Updated interfaces to match Prisma schema
interface Student {
  id: string;
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
    course: {
      name: string;
    };
  };
  overallGrade: number | null;
  attendance?: {
    status: AttendanceStatus;
    minutesLate?: number;
    lesson: {
      date: Date;
    };
  }[];
}

interface CreateStudentInput {
  name: string;
  email: string;
  phone?: string;
  currentGrade: GradeLevel;
  cohortId?: string;
  password?: string; // For initial setup
}

const COURSE_OPTIONS = [
  { label: "All Courses", value: "all" },
  { label: "Software Development", value: "Software Development" },
  { label: "Web Design", value: "Web Design" },
  { label: "Data Science", value: "Data Science" },
] as const;

// Modified StudentCard component
const StudentCard: React.FC<{
  student: Student;
  onEdit: (student: Student) => void;
}> = ({ student, onEdit }) => (
  <Card className="p-4 bg-neutral-100">
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-neutral-700">
            <AvatarImage
              src={student.user.avatar || "/api/placeholder/32/32"}
              alt={student.user.name}
            />
            <AvatarFallback className="text-lg bg-neutral-100 text-black">
              {student.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-base text-black">
              {student.user.name}
            </div>
            <div className="text-sm text-neutral-400">
              {student.cohort?.course.name || "No Course Assigned"}
            </div>
            <div className="text-sm text-neutral-500">{student.studentId}</div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-main text-white hover:bg-second h-9 px-3 min-w-[90px]"
          onClick={() => onEdit(student)}
        >
          Edit
        </Button>
      </div>
      <div className="text-sm text-neutral-700 bg-neutral-100 p-3 rounded border-2 border-neutral-300">
        Grade Level: {student.currentGrade.replace("_", " ")}
      </div>
    </div>
  </Card>
);

// Modified StudentRow component
const StudentRow: React.FC<{
  student: Student;
  onEdit: (student: Student) => void;
}> = ({ student, onEdit }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Avatar className="h-12 w-12 border border-neutral-700">
          <AvatarImage
            src={student.user.avatar || "/api/placeholder/32/32"}
            alt={student.user.name}
          />
          <AvatarFallback className="text-lg bg-neutral-100 text-black">
            {student.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="grid grid-cols-4 gap-8 min-w-[600px]">
          <div>
            <div className="font-semibold text-base text-black">
              {student.user.name}
            </div>
            <div className="text-sm text-neutral-500">{student.studentId}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">
              {student.cohort?.course.name || "No Course"}
            </div>
            <div className="text-sm text-neutral-500">
              {student.currentGrade.replace("_", " ")}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">{student.user.email}</div>
            <div className="text-sm text-neutral-500">
              {student.user.phone || "No phone"}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">
              Expected Graduation:{" "}
              {student.expectedGraduation.toLocaleDateString()}
            </div>
            <div className="text-sm text-neutral-500">
              {student.attendance?.length || 0} attendance records
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="bg-main text-white hover:bg-second h-9 px-3 min-w-[90px]"
        onClick={() => onEdit(student)}
      >
        Edit
      </Button>
    </div>
  </Card>
);

// Main Students component
const Students: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

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

      if (response.ok) {
        await fetchStudents(); // Refresh the list
      }
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

      if (response.ok) {
        await fetchStudents(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" ||
      student.cohort?.course.name === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">MANAGE STUDENTS</h1>
            <p className="text-gray-500">Organize and manage students.</p>
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
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
        </div>
      </div>
    </div>
  );
};

export default Students;
