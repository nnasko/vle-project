"use client";
import React, { useState } from "react";
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
import TimeTableGrid from "./Timetable";
import Link from "next/link";

interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  authorizedAbsence: number;
  unauthorizedAbsence: number;
}

interface User {
  id: number;
  name: string;
  role: "student" | "teacher";
  avatar: string;
  course?: string;
  attendance: AttendanceStats;
}

const Timetables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "all" | "student" | "teacher"
  >("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(true);

  // Mock data - replace with API call
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Atanas Kyurchiev",
      role: "student",
      course: "Software Development",
      avatar: "/api/placeholder/32/32",
      attendance: {
        total: 50,
        present: 45,
        late: 3,
        authorizedAbsence: 1,
        unauthorizedAbsence: 1,
      },
    },
    {
      id: 2,
      name: "Owen Tasker",
      role: "teacher",
      avatar: "/api/placeholder/32/32",
      attendance: {
        total: 60,
        present: 58,
        late: 2,
        authorizedAbsence: 0,
        unauthorizedAbsence: 0,
      },
    },
    // Add more users as needed
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesCourse =
      selectedCourse === "all" ||
      (user.course && user.course === selectedCourse);
    return matchesSearch && matchesRole && matchesCourse;
  });

  const selectedUser = users.find((user) => user.id === selectedUserId);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home className="w-4 h-4" />
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
        {/* Header with search toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedUser
                ? `TIMETABLE: ${selectedUser.name}`
                : "MANAGE TIMETABLES"}
            </h1>
            <p className="text-neutral-400">
              {selectedUser
                ? `${selectedUser.role === "student" ? "Student" : "Teacher"}${
                    selectedUser.course ? ` - ${selectedUser.course}` : ""
                  }`
                : "View and manage timetables for all users"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleSearch}>
            {isSearchVisible ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        {/* Search Panel */}
        {isSearchVisible && (
          <Card className="p-4 bg-neutral-800 mb-6">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select
                value={selectedRole}
                onValueChange={(value: "all" | "student" | "teacher") =>
                  setSelectedRole(value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="Software Development">
                    Software Development
                  </SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Web Design">Web Design</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                {filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className={`min-w-fit ${
                      selectedUserId === user.id
                        ? "bg-neutral-700"
                        : "hover:bg-neutral-700"
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
