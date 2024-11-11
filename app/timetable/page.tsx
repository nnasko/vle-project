"use client";
import React, { useState } from "react";
import TimeTable from "../components/Timetable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

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

const page = () => {
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
  return (
    <div>
      <Breadcrumb className="mb-6 p-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center gap-2">
              <Link href="/">
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Timetable</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="px-32">
        <TimeTable events={events} />
      </div>
    </div>
  );
};

export default page;
