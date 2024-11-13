// app/timetable/page.tsx
"use client";

import { useEffect, useState } from "react";
import TimeTableGrid from "@/app/components/Timetable";
import { TimetableEvent, AttendanceStats } from "@/types/department";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Timetable() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    late: 0,
    authorizedAbsence: 0,
    unauthorizedAbsence: 0,
    averageLateness: 0,
  });

  const fetchTimetable = async (weekStart?: Date) => {
    try {
      setLoading(true);
      let url = "/api/timetables/";

      if (weekStart) {
        url = `/api/timetables/users/me/lessons?weekStart=${weekStart.toISOString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch timetable");

      const data = await response.json();
      setEvents(data.events);
      setAttendanceStats(data.user.attendance || data.attendanceStats);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleWeekChange = async (date: Date) => {
    await fetchTimetable(date);
  };

  if (loading) {
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
          <BreadcrumbItem>
            <BreadcrumbPage>My Timetable</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-7xl mx-auto">
        <TimeTableGrid
          events={events}
          attendanceStats={attendanceStats}
          onWeekChange={handleWeekChange}
        />
      </div>
    </div>
  );
}
