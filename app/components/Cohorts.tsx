"use client";
import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Clock,
  UserCheck,
  CalendarDays,
  BookMarked,
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
import { cn } from "@/lib/utils";

// Type definitions
type AttendanceStatus = "present" | "absent" | "late" | "not-marked";

interface Student {
  id: number;
  name: string;
  email: string;
  status: AttendanceStatus;
  avatar: string;
  overallGrade: string;
  attendance: number;
}

interface Lesson {
  id: number;
  date: string;
  topic: string;
  description: string;
  materials: string[];
  attendance: {
    present: number;
    absent: number;
    late: number;
  };
}

interface Cohort {
  id: number;
  name: string;
  course: string;
  year: string;
  startDate: string;
  endDate: string;
  students: Student[];
  lessons: Lesson[];
  stats: {
    averageAttendance: number;
    averageGrade: number;
    completedLessons: number;
    upcomingLessons: number;
  };
}

interface AttendanceRegisterProps {
  cohort: Cohort;
}

// Components
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
                      <SelectTrigger
                        className={cn("w-[140px]", {
                          "text-green-600":
                            attendance[student.id]?.status === "present",
                          "text-red-600":
                            attendance[student.id]?.status === "absent",
                          "text-yellow-600":
                            attendance[student.id]?.status === "late",
                        })}
                      >
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

const CohortDetail: React.FC<{ cohort: Cohort }> = ({ cohort }) => {
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
            {/* Lesson form would go here */}
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

const CohortsPage = () => {
  const [cohorts, setCohorts] = useState<Cohort[]>([
    {
      id: 1,
      name: "Software Development 2024A",
      course: "Software Development",
      year: "Year 2",
      startDate: "2024-01-15",
      endDate: "2024-12-20",
      students: [
        {
          id: 1,
          name: "John Doe",
          email: "john.d@example.com",
          status: "present",
          avatar: "/api/placeholder/32/32",
          overallGrade: "A",
          attendance: 95,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.s@example.com",
          status: "present",
          avatar: "/api/placeholder/32/32",
          overallGrade: "B+",
          attendance: 88,
        },
      ],
      lessons: [
        {
          id: 1,
          date: "2024-11-06",
          topic: "Introduction to React",
          description: "Fundamentals of React and component-based architecture",
          materials: ["Slides", "Code Examples"],
          attendance: { present: 18, absent: 2, late: 1 },
        },
        {
          id: 2,
          date: "2024-03-16",
          topic: "State Management",
          description: "Understanding React state and props",
          materials: ["Documentation", "Exercises"],
          attendance: { present: 19, absent: 1, late: 1 },
        },
      ],
      stats: {
        averageAttendance: 92,
        averageGrade: 85,
        completedLessons: 24,
        upcomingLessons: 12,
      },
    },
  ]);

  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const handleCreateCohort = (formData: {
    name: string;
    course: string;
    year: string;
    startDate: string;
    endDate: string;
  }) => {
    const newCohort: Cohort = {
      id: cohorts.length + 1,
      name: formData.name,
      course: formData.course,
      year: formData.year,
      startDate: formData.startDate,
      endDate: formData.endDate,
      students: [],
      lessons: [],
      stats: {
        averageAttendance: 0,
        averageGrade: 0,
        completedLessons: 0,
        upcomingLessons: 0,
      },
    };

    setCohorts((prev) => [newCohort, ...prev]);
  };

  const handleUpdateCohort = (updatedCohort: Cohort) => {
    setCohorts((prev) =>
      prev.map((cohort) =>
        cohort.id === updatedCohort.id ? updatedCohort : cohort
      )
    );
  };

  const filteredCohorts = cohorts.filter((cohort) => {
    const matchesSearch = cohort.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || cohort.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  if (selectedCohort) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedCohort(null)}
              className="mb-4"
            >
              ← Back to Cohorts
            </Button>
            <CohortDetail cohort={selectedCohort} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">MANAGE COHORTS</h1>
            <p className="text-gray-500">
              View and manage your teaching groups
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-main hover:bg-second">
                <Plus className="w-4 h-4 mr-2" />
                New Cohort
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Cohort</DialogTitle>
                <DialogDescription>
                  Set up a new teaching group with basic details
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4 py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleCreateCohort({
                    name: formData.get("name") as string,
                    course: formData.get("course") as string,
                    year: formData.get("year") as string,
                    startDate: formData.get("startDate") as string,
                    endDate: formData.get("endDate") as string,
                  });
                }}
              >
                <div className="space-y-2">
                  <Input name="name" placeholder="Cohort Name" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select name="course" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Development">
                        Software Development
                      </SelectItem>
                      <SelectItem value="Web Design">Web Design</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="year" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year 1">Year 1</SelectItem>
                      <SelectItem value="year 2">year 2</SelectItem>
                      <SelectItem value="year 3">year 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="startDate"
                    type="date"
                    placeholder="Start Date"
                    required
                  />
                  <Input
                    name="endDate"
                    type="date"
                    placeholder="End Date"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-main hover:bg-second">
                    Create Cohort
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-neutral-700 p-8 rounded-lg">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search cohorts..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={courseFilter}
              onValueChange={(value) => setCourseFilter(value)}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Software Development">
                  Software Development
                </SelectItem>
                <SelectItem value="Web Design">Web Design</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredCohorts.map((cohort) => (
              <Card
                key={cohort.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCohort(cohort)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{cohort.name}</h3>
                    <p className="text-sm text-gray-500">{cohort.course}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(cohort.startDate).toLocaleDateString()} -{" "}
                      {new Date(cohort.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{cohort.year}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {cohort.students.length} Students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {cohort.stats.completedLessons} Lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {cohort.stats.averageAttendance}% Attendance
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {cohort.stats.averageGrade}% Average
                    </span>
                  </div>
                </div>

                {cohort.lessons.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Next Lesson</h4>
                    <p className="text-sm text-gray-500">
                      {cohort.lessons[0].topic} -{" "}
                      {new Date(cohort.lessons[0].date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortsPage;
