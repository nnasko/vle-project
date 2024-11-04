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
import { LayoutGrid, List, Plus } from "lucide-react";
import StudentDialog from "./StudentDialog";

// Common interfaces
export interface Log {
  date: string;
  type: string;
  staff: string;
  comment: string;
}

export interface Student {
  id: number;
  name: string;
  course: string;
  avatar: string;
  email: string;
  phone: string;
  studentId: string;
  status: "active" | "on-leave" | "withdrawn" | "graduated";
  enrollmentDate: string;
  expectedGraduation: string;
  academicYear: number;
  logs: Log[];
}

interface ViewProps {
  student: Student;
  onAddLog: (id: number) => void;
  onUpdate: (data: Student) => void;
  expandedStudent: number | null;
  existingIds: string[];
}

export type CreateStudent = Omit<Student, "id"> & { id?: number };

interface ViewProps {
  student: Student;
  onAddLog: (id: number) => void;
  onUpdate: (data: Student) => void;
  expandedStudent: number | null;
  existingIds: string[];
}

const StudentCard: React.FC<ViewProps> = ({
  student,
  onAddLog,
  onUpdate,
  expandedStudent,
  existingIds,
}) => (
  <Card className="p-4 bg-neutral-100">
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-neutral-700">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="text-lg bg-neutral-100 text-black">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-base text-black">
              {student.name}
            </div>
            <div className="text-sm text-neutral-400">{student.course}</div>
            <div className="text-sm text-neutral-500">{student.studentId}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <StudentDialog
            mode="edit"
            student={student}
            existingIds={existingIds}
            onSubmit={onUpdate}
            expandedSections={{
              personal: false,
              academic: false,
              logs: true,
            }}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="bg-main text-white hover:bg-second h-9 px-3 min-w-[90px]"
                onClick={() => onAddLog(student.id)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Log
              </Button>
            }
          />
          <StudentDialog
            mode="edit"
            student={student}
            existingIds={existingIds}
            onSubmit={onUpdate}
            expandedSections={{
              personal: true,
              academic: true,
              logs: false,
            }}
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
      {student.logs.length > 0 && (
        <div className="text-sm text-neutral-700 bg-neutral-100 p-3 rounded border-2 border-neutral-300">
          Latest: {student.logs[0].comment}
        </div>
      )}
    </div>
  </Card>
);

const StudentRow: React.FC<ViewProps> = ({
  student,
  onAddLog,
  onUpdate,
  expandedStudent,
  existingIds,
}) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Avatar className="h-12 w-12 border border-neutral-700">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback className="text-lg bg-neutral-100 text-black">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="grid grid-cols-4 gap-8 min-w-[600px]">
          <div>
            <div className="font-semibold text-base text-black">
              {student.name}
            </div>
            <div className="text-sm text-neutral-500">{student.studentId}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">{student.course}</div>
            <div className="text-sm text-neutral-500 capitalize">
              {student.status}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">{student.email}</div>
            <div className="text-sm text-neutral-500">{student.phone}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">
              Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-neutral-500">
              {student.logs.length} log entries
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <StudentDialog
          mode="edit"
          student={student}
          existingIds={existingIds}
          onSubmit={onUpdate}
          expandedSections={{
            personal: false,
            academic: false,
            logs: true,
          }}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="bg-main text-white hover:bg-second h-9 px-3 min-w-[90px]"
              onClick={() => onAddLog(student.id)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Log
            </Button>
          }
        />
        <StudentDialog
          mode="edit"
          student={student}
          existingIds={existingIds}
          onSubmit={onUpdate}
          expandedSections={{
            personal: true,
            academic: true,
            logs: false,
          }}
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
  </Card>
);

const COURSE_OPTIONS = [
  { label: "All Courses", value: "all" },
  { label: "Software Development", value: "Software Development" },
  { label: "Web Design", value: "Web Design" },
  { label: "Data Science", value: "Data Science" },
] as const;

const Students: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Atanas Kyurkchiev",
      course: "Software Development",
      avatar: "/api/placeholder/32/32",
      email: "atanas.k@example.com",
      phone: "+1234567890",
      studentId: "SD2024001",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      academicYear: currentYear,
      logs: [
        {
          date: "2024-03-15",
          type: "Academic Review",
          staff: "Dr. Smith",
          comment: "Excellent progress in frontend development",
        },
        {
          date: "2024-02-20",
          type: "Attendance",
          staff: "Mrs. Wilson",
          comment: "Perfect attendance this month",
        },
      ],
    },
    {
      id: 2,
      name: "Joseph Mitsi",
      course: "Software Development",
      avatar: "/api/placeholder/32/32",
      email: "joseph.m@example.com",
      phone: "+1234567891",
      studentId: "SD2024002",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      academicYear: currentYear,
      logs: [
        {
          date: "2024-03-10",
          type: "Counseling",
          staff: "Prof. Jones",
          comment: "Career guidance session completed",
        },
      ],
    },
    {
      id: 3,
      name: "Oliver Witmond-Harris",
      course: "Data Science",
      avatar: "/api/placeholder/32/32",
      email: "oliver.wh@example.com",
      phone: "+1234567892",
      studentId: "DS2024003",
      status: "on-leave",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      academicYear: currentYear,
      logs: [
        {
          date: "2024-03-01",
          type: "Academic Review",
          staff: "Dr. Smith",
          comment: "Struggling with advanced statistics",
        },
        {
          date: "2024-03-05",
          type: "Attendance",
          staff: "Mrs. Wilson",
          comment: "Medical leave approved",
        },
      ],
    },
    {
      id: 4,
      name: "Jack Ames",
      course: "Web Design",
      avatar: "/api/placeholder/32/32",
      email: "jack.a@example.com",
      phone: "+1234567893",
      studentId: "WD2024004",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      academicYear: currentYear,
      logs: [
        {
          date: "2024-03-12",
          type: "Behavior",
          staff: "Prof. Jones",
          comment: "Outstanding contribution to class projects",
        },
      ],
    },
    {
      id: 5,
      name: "Luke Wilson",
      course: "Software Development",
      avatar: "/api/placeholder/32/32",
      email: "luke.w@example.com",
      phone: "+1234567894",
      studentId: "SD2024005",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      academicYear: currentYear,
      logs: [
        {
          date: "2024-03-08",
          type: "Academic Review",
          staff: "Dr. Smith",
          comment: "Exceptional performance in backend development",
        },
      ],
    },
  ]);

  const handleCreateStudent = (studentData: CreateStudent) => {
    const newStudent: Student = {
      ...studentData,
      id: students.length + 1,
      avatar: "/api/placeholder/32/32",
      logs: studentData.logs || [],
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (studentData: Student) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentData.id ? { ...student, ...studentData } : student
      )
    );
    setExpandedStudent(null);
  };

  const handleAddLog = (studentId: number) => {
    setExpandedStudent(studentId);
  };

  const existingIds = students.map((student) => student.studentId);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">MANAGE STUDENTS</h1>
          <StudentDialog
            mode="create"
            existingIds={existingIds}
            onSubmit={handleCreateStudent}
          />
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
                    onAddLog={handleAddLog}
                    onUpdate={handleUpdateStudent}
                    expandedStudent={expandedStudent}
                    existingIds={existingIds}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onAddLog={handleAddLog}
                    onUpdate={handleUpdateStudent}
                    expandedStudent={expandedStudent}
                    existingIds={existingIds}
                  />
                ))}
              </div>
            )}
          </div>

          {filteredStudents.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "outline"}
                  className={`w-8 h-8 p-0 ${
                    page === 1 ? "bg-second text-white" : "text-black"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
