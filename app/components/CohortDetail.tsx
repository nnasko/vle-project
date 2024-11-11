// components/CohortDetail.tsx
"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCheck,
  TrendingUp,
  BookMarked,
  CalendarDays,
  Plus,
  CalendarX2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { AttendanceStatus, Cohort, Student, Lesson } from "@/types/cohort";

interface AttendanceRegisterProps {
  cohort: Cohort;
}

const AttendanceRegister: React.FC<AttendanceRegisterProps> = ({ cohort }) => {
  const today = new Date().toISOString().split("T")[0];
  const todaysLessons = cohort.lessons.filter(
    (lesson) => lesson.date === today
  );

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [attendance, setAttendance] = useState<
    Record<
      number,
      {
        status: AttendanceStatus;
        notes: string;
      }
    >
  >({});

  const handleAttendanceChange = useCallback(
    (studentId: number, field: "status" | "notes", value: string) => {
      setAttendance((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value,
        },
      }));
    },
    []
  );

  const handleSaveAttendance = useCallback(() => {
    if (!selectedLesson) return;

    toast.success("Attendance has been saved successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, [selectedLesson]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Todays Register</h3>
        <div className="flex gap-4">
          <Select
            value={selectedLesson?.id.toString() ?? ""}
            onValueChange={(value) => {
              const lesson = cohort.lessons.find(
                (l) => l.id.toString() === value
              );
              setSelectedLesson(lesson ?? null);
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue
                placeholder={
                  todaysLessons.length > 0
                    ? "Select a lesson"
                    : "No lessons scheduled for today"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {todaysLessons.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id.toString()}>
                  {lesson.topic} (
                  {new Date(lesson.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  )
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="bg-main hover:bg-second"
            onClick={handleSaveAttendance}
            disabled={
              !selectedLesson ||
              Object.values(attendance).some((a) => a.status === "not-marked")
            }
          >
            Save Register
          </Button>
        </div>
      </div>

      {selectedLesson ? (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohort.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={attendance[student.id]?.status ?? "not-marked"}
                      onValueChange={(value: AttendanceStatus) =>
                        handleAttendanceChange(student.id, "status", value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Add notes..."
                      value={attendance[student.id]?.notes ?? ""}
                      onChange={(e) =>
                        handleAttendanceChange(
                          student.id,
                          "notes",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="p-8 text-center text-gray-500">
          {todaysLessons.length > 0 ? (
            <p>Please select a lesson to take attendance</p>
          ) : (
            <div className="space-y-2">
              <CalendarX2 className="w-8 h-8 mx-auto text-gray-400" />
              <p>No lessons scheduled for today</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export const CohortDetail: React.FC<{ cohort: Cohort }> = ({ cohort }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{cohort.name}</h2>
          <p className="text-gray-500">{cohort.course}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-main hover:bg-second">
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
              <DialogDescription>
                Plan a new lesson for this cohort
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-main" />
            <span className="text-sm text-gray-500">Attendance Rate</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {cohort.stats.averageAttendance}%
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-main" />
            <span className="text-sm text-gray-500">Average Grade</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {cohort.stats.averageGrade}%
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-main" />
            <span className="text-sm text-gray-500">Completed Lessons</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {cohort.stats.completedLessons}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-main" />
            <span className="text-sm text-gray-500">Upcoming Lessons</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {cohort.stats.upcomingLessons}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cohort.lessons.map((lesson) => ({
                    date: lesson.date,
                    attendance:
                      (lesson.attendance.present /
                        (lesson.attendance.present +
                          lesson.attendance.absent +
                          lesson.attendance.late)) *
                      100,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#473BF0"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Overall Grade</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohort.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.overallGrade}</TableCell>
                    <TableCell>{student.attendance}%</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "present"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          <Card className="p-4">
            <div className="space-y-4">
              {cohort.lessons.map((lesson) => (
                <Card key={lesson.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{lesson.topic}</h4>
                      <p className="text-sm text-gray-500">{lesson.date}</p>
                      <p className="mt-2">{lesson.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Attendance</div>
                      <div className="font-medium">
                        {Math.round(
                          (lesson.attendance.present /
                            (lesson.attendance.present +
                              lesson.attendance.absent +
                              lesson.attendance.late)) *
                            100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="p-4">
            <AttendanceRegister cohort={cohort} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
