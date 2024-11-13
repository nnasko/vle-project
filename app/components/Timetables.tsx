/* eslint-disable @typescript-eslint/no-unused-vars */
// app/admin/timetables/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import TimeTableGrid from "@/app/components/Timetable";
import Link from "next/link";
import {
  TimetableUser,
  TimetableEvent,
  NewLessonRequest,
  UserRole,
  Teacher,
} from "@/types/department";
import AddLessonDialog from "./dialogs/AddLessonDialog";

const Timetables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedRole, setSelectedRole] = useState<"all" | UserRole>("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [users, setUsers] = useState<TimetableUser[]>([]);
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(true);

  const [newLesson, setNewLesson] = useState<
    Omit<NewLessonRequest, "teacherId">
  >({
    moduleId: "",
    cohortId: "",
    topic: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    materials: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserTimetable(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchInitialData = async () => {
    try {
      setIsLoadingUsers(true);
      setError(null);

      const [usersResponse, departmentsResponse, teachersResponse] =
        await Promise.all([
          fetch("/api/timetables/users"),
          fetch("/api/departments"),
          fetch("/api/teachers"),
        ]);

      if (
        !usersResponse.ok ||
        !departmentsResponse.ok ||
        !teachersResponse.ok
      ) {
        throw new Error("Failed to fetch data");
      }

      const teachersData = await teachersResponse.json();
      setTeachers(teachersData || []);

      const usersData = await usersResponse.json();
      const departmentsData = await departmentsResponse.json();

      setUsers(usersData.users || []);
      setDepartments(departmentsData.departments || []);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      setError("Failed to load users and departments");
      setUsers([]);
      setDepartments([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };
  const fetchUserTimetable = async (userId: string) => {
    try {
      setIsLoadingTimetable(true);
      setError(null);

      const response = await fetch(`/api/timetables/users/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch timetable");
      }
      const data = await response.json();
      console.log(data);
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch user timetable:", error);
      setError("Failed to load timetable");
      setEvents([]);
    } finally {
      setIsLoadingTimetable(false);
    }
  };

  const handleWeekChange = async (date: Date) => {
    if (!selectedUser) return;

    try {
      setIsLoadingTimetable(true);
      setError(null);

      const response = await fetch(
        `/api/timetables/users/${
          selectedUser.id
        }/lessons?weekStart=${date.toISOString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch timetable");
      }

      const data = await response.json();
      setEvents(data.events || []);
      // Update attendance stats if needed
    } catch (error) {
      console.error("Failed to fetch user timetable:", error);
      setError("Failed to load timetable");
      setEvents([]);
    } finally {
      setIsLoadingTimetable(false);
    }
  };

  const handleAddLesson = async (lessonData: NewLessonRequest) => {
    try {
      if (!selectedUser) {
        throw new Error("No user selected");
      }

      const cohortId = getStudentCohortId(selectedUser);
      if (!cohortId) {
        throw new Error("Student is not assigned to a cohort");
      }

      // Create the request data with proper IDs
      const requestData = {
        ...lessonData,
        cohortId,
        studentId:
          selectedUser.role === UserRole.STUDENT ? selectedUser.id : undefined,
      };

      console.log("Sending lesson data:", requestData);

      const response = await fetch("/api/timetables/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create lesson");
      }

      const createdLesson = await response.json();
      setEvents((prev) => [...prev, createdLesson]);

      // Refresh the timetable
      await fetchUserTimetable(selectedUser.id);
    } catch (error) {
      console.error("Failed to add lesson:", error);
      throw error;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesDepartment =
      selectedDepartment === "all" || user.departmentId === selectedDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const selectedUser = users.find((user) => user.id === selectedUserId);

  // Add a helper function to safely get the teacher ID
  const getDefaultTeacherId = (
    user: TimetableUser | undefined
  ): string | undefined => {
    return user?.cohort?.teacher?.user?.id;
  };

  // Add a helper function to safely get the cohort ID
  const getStudentCohortId = (
    user: TimetableUser | undefined
  ): string | undefined => {
    console.log("User data:", user); // Debug log
    const cohortId = user?.cohortId;
    console.log("Found cohort ID:", cohortId); // Debug log
    return cohortId;
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {selectedUser ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/timetables">Timetables</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedUser.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Timetables</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedUser
                ? `TIMETABLE: ${selectedUser.name}`
                : "MANAGE TIMETABLES"}
            </h1>
            <p className="text-neutral-400">
              {selectedUser
                ? `${
                    selectedUser.role.charAt(0) +
                    selectedUser.role.slice(1).toLowerCase()
                  }`
                : "View and manage timetables for all users"}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedUser?.role === UserRole.STUDENT && (
              <AddLessonDialog
                onAddLesson={handleAddLesson}
                teachers={teachers}
                defaultTeacherId={getDefaultTeacherId(selectedUser)}
                studentCohortId={getStudentCohortId(selectedUser)}
                isLoading={isLoadingTimetable}
              />
            )}
            <Button variant="outline" size="sm" onClick={toggleSearch}>
              {isSearchVisible ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>
        </div>

        {/* Search Panel */}
        {isSearchVisible && (
          <Card className="p-4 bg-neutral-700 mb-6">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select
                value={selectedRole}
                onValueChange={(value: "all" | UserRole) =>
                  setSelectedRole(value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="TEACHER">Teachers</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                {filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className={`min-w-fit ${
                      selectedUserId === user.id
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        {selectedUser ? (
          <TimeTableGrid
            userId={selectedUser.id}
            userName={selectedUser.name}
            events={events}
            isTeacher={selectedUser.role === UserRole.TEACHER}
            attendanceStats={selectedUser.attendance}
            onWeekChange={handleWeekChange}
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-neutral-400">
            Select a user to view their timetable
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetables;
