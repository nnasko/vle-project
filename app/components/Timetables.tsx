
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Home, Plus } from "lucide-react";
import TimeTableGrid from "./Timetable";
import Link from "next/link";

interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  authorizedAbsence: number;
  unauthorizedAbsence: number;
}

interface Event {
  id: number;
  title: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
  cohortId?: string;
  studentId?: string;
  attendance?: {
    status: "present" | "late" | "absent" | "authorized";
    minutes?: number;
  };
}

interface User {
  id: number;
  name: string;
  role: "student" | "teacher";
  avatar: string;
  course?: string;
  cohortID?: number;
  attendance: AttendanceStats;
}

interface NewEvent {
  title: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  assignTo: "cohort" | "student";
  cohortId?: string;
  studentId?: string;
}

const Timetables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "all" | "student" | "teacher"
  >("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Advanced Frameworks",
      instructor: "Owen Tasker",
      day: "MON",
      startTime: "09:00",
      endTime: "11:00",
      room: "Games Lab 3",
      color: "bg-indigo-600",
      cohortId: "1",
    },
    {
      id: 2,
      title: "Professional Development",
      instructor: "Chris Martin",
      day: "MON",
      startTime: "11:00",
      endTime: "12:00",
      room: "Seminar Room 3",
      color: "bg-indigo-600",
      cohortId: "1",
    },
    {
      id: 3,
      title: "Front End Development",
      instructor: "Owen Tasker",
      day: "MON",
      startTime: "13:00",
      endTime: "15:00",
      room: "Games Lab 3",
      color: "bg-indigo-600",
      cohortId: "1",
    },
    {
      id: 4,
      title: "Industry Concepts",
      instructor: "Owen Tasker",
      day: "MON",
      startTime: "15:30",
      endTime: "17:00",
      room: "Games Lab 3",
      color: "bg-indigo-600",
      cohortId: "1",
    },
    {
      id: 5,
      title: "Object Oriented Programming",
      instructor: "Gavin Thomas",
      day: "TUE",
      startTime: "11:30",
      endTime: "13:30",
      room: "Seminar Room 2",
      color: "bg-indigo-600",
      cohortId: "1",
    },
    {
      id: 6,
      title: "Industry Skills",
      instructor: "John Gordon",
      day: "TUE",
      startTime: "15:00",
      endTime: "16:30",
      room: "Media Lab 1",
      color: "bg-indigo-600",
      cohortId: "1",
    },
    {
      id: 7,
      title: "Back-End Development",
      instructor: "Owen Tasker",
      day: "WED",
      startTime: "09:00",
      endTime: "11:00",
      room: "Games Lab 3",
      color: "bg-indigo-600",
      cohortId: "2",
    },
    {
      id: 8,
      title: "Course Progress",
      instructor: "Gavin Thomas",
      day: "WED",
      startTime: "11:00",
      endTime: "12:00",
      room: "Seminar Room 2",
      color: "bg-indigo-600",
      cohortId: "2",
    },
    {
      id: 9,
      title: "Occupational Specialism",
      instructor: "Owen Tasker",
      day: "WED",
      startTime: "12:30",
      endTime: "14:30",
      room: "Games Lab 3",
      color: "bg-indigo-600",
      cohortId: "2",
    },
    {
      id: 10,
      title: "Research & Development",
      instructor: "Owen Tasker",
      day: "WED",
      startTime: "15:00",
      endTime: "16:30",
      room: "Games Lab 3",
      color: "bg-indigo-600",
      cohortId: "2",
    },
  ]);

  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    instructor: "",
    day: "",
    startTime: "",
    endTime: "",
    room: "",
    assignTo: "cohort",
  });

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
      cohortID: 1,
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
      cohortID: 2,
    },
  ]);

  const cohorts = [
    { id: "1", name: "Software Development Year 1" },
    { id: "2", name: "Data Science Year 2" },
  ];

  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  const handleAddEvent = () => {
    const newId = Math.max(...events.map((e) => e.id), 0) + 1;
    const newEventComplete: Event = {
      ...newEvent,
      id: newId,
      color: "bg-indigo-600",
      cohortId: newEvent.assignTo === "cohort" ? newEvent.cohortId : undefined,
      studentId:
        newEvent.assignTo === "student" ? newEvent.studentId : undefined,
    };

    setEvents([...events, newEventComplete]);
    setNewEvent({
      title: "",
      instructor: "",
      day: "",
      startTime: "",
      endTime: "",
      room: "",
      assignTo: "cohort",
    });
  };

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

  const filteredEvents = events.filter((event) => {
    if (
      selectedUser?.role === "student" &&
      event.studentId === selectedUser.id.toString()
    )
      return true;
    if (
      selectedUser?.cohortID &&
      event.cohortId === selectedUser.cohortID.toString()
    )
      return true;
    return false;
  });

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="p-6 min-h-screen">
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
        {/* Header with search toggle and add event button */}
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
          <div className="flex gap-2">
            {selectedUser?.role === "student" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-main hover:bg-second text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-800 border-neutral-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Add New Event
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-white">Event Title</Label>
                      <Input
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, title: e.target.value })
                        }
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-white">Instructor</Label>
                      <Input
                        value={newEvent.instructor}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            instructor: e.target.value,
                          })
                        }
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-white">Room</Label>
                      <Input
                        value={newEvent.room}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, room: e.target.value })
                        }
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-white">Day</Label>
                      <Select
                        value={newEvent.day}
                        onValueChange={(value) =>
                          setNewEvent({ ...newEvent, day: value })
                        }
                      >
                        <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-800 border-neutral-700">
                          {days.map((day) => (
                            <SelectItem
                              key={day}
                              value={day}
                              className="text-white"
                            >
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-white">Start Time</Label>
                        <Input
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              startTime: e.target.value,
                            })
                          }
                          className="bg-neutral-700 border-neutral-600 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-white">End Time</Label>
                        <Input
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              endTime: e.target.value,
                            })
                          }
                          className="bg-neutral-700 border-neutral-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddEvent}
                      className="bg-main hover:bg-second text-white"
                    >
                      Add Event
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
            events={filteredEvents}
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
