// app/cohorts/page.tsx
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React, { useState } from "react";
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
import { Users, BookOpen, Clock, GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { Cohort } from "@/types/Cohort"; // We'll create this type definition file

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

  const filteredCohorts = cohorts.filter((cohort) => {
    const matchesSearch = cohort.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || cohort.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="p-6 min-h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cohorts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
              <Link key={cohort.id} href={`/cohorts/${cohort.id}`}>
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortsPage;
