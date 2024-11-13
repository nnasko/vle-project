import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  UserPlus,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  School,
} from "lucide-react";
import { toast } from "react-toastify";

interface Lesson {
  id: string;
  date: string;
  attendance: {
    status: "PRESENT" | "LATE" | "ABSENT" | "AUTHORIZED";
  }[];
}

interface Student {
  id: string;
  overallGrade?: number;
}

interface TeacherUser {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  user: TeacherUser;
  position: string;
  department: {
    id: string;
    name: string;
  };
}

interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentStudents: number;
  isActive: boolean;
  students: Student[];
  lessons: Lesson[];
  teacher: Teacher;
  additionalTeachers: Teacher[];
  department: {
    id: string;
    name: string;
  };
}

interface Department {
  id: string;
  name: string;
  teachers: Teacher[];
  cohorts: Cohort[];
}

interface CohortsTabProps {
  department: Department;
}

interface CohortStats {
  attendanceRate: number;
  averageGrade: number;
  lessonsCompleted: number;
  upcomingLessons: number;
}

const CohortsTab: React.FC<CohortsTabProps> = ({ department }) => {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);

  const calculateCohortStats = (cohort: Cohort): CohortStats => {
    // Ensure lessons array exists and has items
    const lessons = cohort?.lessons || [];
    const students = cohort?.students || [];

    // Calculate attendance rate
    const attendanceRate = lessons.length
      ? lessons.reduce((acc, lesson) => {
          const totalStudents = lesson?.attendance?.length || 0;
          if (totalStudents === 0) return acc;

          const presentStudents =
            lesson?.attendance?.filter(
              (a) => a?.status === "PRESENT" || a?.status === "LATE"
            ).length || 0;

          return acc + (presentStudents / totalStudents) * 100;
        }, 0) / lessons.length
      : 0;

    // Calculate average grade
    const averageGrade = students.length
      ? students.reduce(
          (acc, student) => acc + (student?.overallGrade || 0),
          0
        ) / students.length
      : 0;

    // Calculate completed and upcoming lessons
    const now = new Date();
    const completedLessons = lessons.filter(
      (l) => new Date(l.date) < now
    ).length;
    const upcomingLessons = lessons.filter(
      (l) => new Date(l.date) >= now
    ).length;

    return {
      attendanceRate,
      averageGrade,
      lessonsCompleted: completedLessons,
      upcomingLessons,
    };
  };

  const handleAssignTeacher = async (cohortId: string, teacherId: string) => {
    setIsAssigningTeacher(true);
    try {
      const response = await fetch(`/api/cohorts/${cohortId}/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign teacher");
      }

      toast.success("Teacher assigned successfully");
      setSelectedCohortId(null);
      // You would typically refresh the cohort data here
    } catch (error) {
      console.error("Error assigning teacher:", error);
      toast.error("Failed to assign teacher");
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  const getAvailableTeachers = (cohortId: string): Teacher[] => {
    const cohort = department.cohorts.find((c) => c.id === cohortId);
    if (!cohort) return [];

    const assignedTeacherIds = [
      cohort.teacher.id,
      ...(cohort.additionalTeachers?.map((t) => t.id) || []),
    ];

    return department.teachers.filter(
      (teacher) => !assignedTeacherIds.includes(teacher.id)
    );
  };

  return (
    <div className="space-y-4">
      {department.cohorts.map((cohort) => {
        const stats = calculateCohortStats(cohort);
        const allTeachers = [
          cohort.teacher,
          ...(cohort.additionalTeachers || []),
        ];

        return (
          <Card key={cohort.id} className="p-6">
            {/* Cohort Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{cohort.name}</h3>
                  <Badge variant={cohort.isActive ? "default" : "secondary"}>
                    {cohort.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(cohort.startDate), "MMM yyyy")} -{" "}
                  {format(new Date(cohort.endDate), "MMM yyyy")}
                </p>
              </div>

              {/* Add Teacher Dialog */}
              <Dialog
                open={selectedCohortId === cohort.id}
                onOpenChange={(open) => !open && setSelectedCohortId(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCohortId(cohort.id)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Additional Teacher</DialogTitle>
                    <DialogDescription>
                      Select a teacher to assign to {cohort.name}
                    </DialogDescription>
                  </DialogHeader>
                  <Select
                    disabled={isAssigningTeacher}
                    onValueChange={(value) =>
                      handleAssignTeacher(cohort.id, value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTeachers(cohort.id).map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.user.name} - {teacher.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Users className="w-4 h-4" />
                  <span>Students</span>
                </div>
                <p className="text-2xl font-bold">
                  {cohort.currentStudents}/{cohort.maxStudents}
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Attendance Rate</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats.attendanceRate.toFixed(1)}%
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Average Grade</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats.averageGrade.toFixed(1)}%
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Lessons</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats.lessonsCompleted}/
                  {stats.lessonsCompleted + stats.upcomingLessons}
                </p>
              </div>
            </div>

            {/* Teachers Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium">Teaching Staff</h4>
                <Badge variant="outline" className="text-xs">
                  {allTeachers.length} Teachers
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTeachers.map((teacher) => (
                  <Badge
                    key={teacher.id}
                    variant="outline"
                    className="flex items-center gap-1 py-1 px-3"
                  >
                    <Users className="w-3 h-3" />
                    <div className="flex flex-col items-start">
                      <span>{teacher.user.name}</span>
                      <span className="text-xs text-gray-500">
                        {teacher.position}
                        {teacher.id === cohort.teacher.id && " (Lead)"}
                      </span>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        );
      })}

      {department.cohorts.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Cohorts Found</h3>
          <p>There are no cohorts in this department yet.</p>
        </Card>
      )}
    </div>
  );
};

export default CohortsTab;
