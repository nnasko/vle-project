"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserCheck, Clock, Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
  attendance?: {
    status: "present" | "late" | "absent" | "authorized";
    minutes?: number;
  };
}

interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  authorizedAbsence: number;
  unauthorizedAbsence: number;
  averageLateness: number;
}

interface TimeTableGridProps {
  userId?: number;
  userName?: string;
  events: Event[];
  isTeacher?: boolean;
}

type AttendanceStatus = "present" | "late" | "absent" | "authorized";

const TimeTableGrid: React.FC<TimeTableGridProps> = ({
  userId,
  userName,
  events = [],
  isTeacher = false,
}) => {
  const [attendanceStats] = useState<AttendanceStats>({
    total: 50,
    present: 45,
    late: 3,
    authorizedAbsence: 1,
    unauthorizedAbsence: 1,
    averageLateness: 8,
  });

  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const calculateEventPosition = (
    startTime: string,
    endTime: string,
    day: string
  ) => {
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours + minutes / 60;
    };

    const startHour = parseTime(startTime);
    const endHour = parseTime(endTime);

    const top = ((startHour - 9) / 8) * 100;
    const height = ((endHour - startHour) / 8) * 100;
    const left = days.indexOf(day) * 20;
    // Reduced width and added margin for better spacing
    const width = 19;

    return {
      top: `${top}%`,
      height: `${height}%`,
      left: `${left}%`,
      width: `${width}%`,
      heightPercent: height,
    };
  };

  const getAttendanceColor = (status: AttendanceStatus | undefined) => {
    switch (status) {
      case "present":
        return "bg-emerald-500";
      case "late":
        return "bg-yellow-500";
      case "absent":
        return "bg-red-500";
      case "authorized":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 p-6 overflow-auto">
      <div className="bg-neutral-800 rounded-md p-4">
        {/* Attendance Overview */}
        <Card className="bg-neutral-800 border-2 border-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-neutral-400">
                  Attendance Rate
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {(
                  (attendanceStats.present / attendanceStats.total) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-neutral-400">Punctuality</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {(
                  ((attendanceStats.present + attendanceStats.late) /
                    attendanceStats.total) *
                  100
                ).toFixed(1)}
                %
              </p>
              {attendanceStats.late > 0 && (
                <p className="text-xs text-yellow-500">
                  Avg. {attendanceStats.averageLateness} mins late
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-neutral-400">Sessions</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {attendanceStats.total}
              </p>
              <div className="flex gap-2 text-xs">
                <span className="text-emerald-500">
                  {attendanceStats.present} present
                </span>
                <span className="text-yellow-500">
                  {attendanceStats.late} late
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-neutral-400">Absences</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {attendanceStats.authorizedAbsence +
                  attendanceStats.unauthorizedAbsence}
              </p>
              <div className="flex gap-2 text-xs">
                <span className="text-blue-500">
                  {attendanceStats.authorizedAbsence} authorized
                </span>
                <span className="text-red-500">
                  {attendanceStats.unauthorizedAbsence} unauthorized
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Timetable Controls */}
        <div className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center gap-4 mt-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              {userName ? `${userName}'s Timetable` : "Your Timetable"}
            </h2>
            <Select>
              <SelectTrigger className="w-[150px] bg-neutral-800 border-neutral-600 text-white">
                <SelectValue placeholder="Select Week" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                <SelectItem value="current">Current Week</SelectItem>
                <SelectItem value="next">Next Week</SelectItem>
                <SelectItem value="previous">Previous Week</SelectItem>
                <SelectItem value="custom">Custom Week</SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant="outline"
              className="h-9 px-4 rounded-md flex items-center bg-neutral-800 border-neutral-600 text-neutral-200"
            >
              Week 23 - June 3-7, 2024
            </Badge>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="bg-neutral-800 p-6 rounded-lg mt-4">
          <div className="relative h-[640px] rounded-lg overflow-hidden">
            {/* Time labels */}
            <div className="absolute left-0 top-12 w-16 h-[calc(100%-48px)] border-r border-gray-700 bg-neutral-800 z-20">
              {timeSlots.map((time, i) => (
                <div
                  key={time}
                  className="absolute w-full text-right pr-2 text-sm text-gray-300"
                  style={{
                    top: `${(i * 100) / 8}%`,
                    transform: "translateY(-50%)",
                  }}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day headers */}
            <div className="absolute left-0 right-0 top-0 h-12 border-b border-gray-700 flex bg-neutral-800 z-10">
              <div className="w-16 border-r border-gray-700" />
              {days.map((day) => (
                <div
                  key={day}
                  className="flex-1 text-center font-bold py-3 border-r border-gray-700 last:border-r-0 text-gray-300"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid lines */}
            <div className="absolute left-16 right-0 top-12 bottom-0">
              {/* Vertical lines */}
              {days.map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-r border-gray-700"
                  style={{ left: `${(i * 100) / 5}%` }}
                />
              ))}

              {/* Horizontal lines */}
              {timeSlots.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-b border-gray-700"
                  style={{ top: `${(i * 100) / 8}%` }}
                />
              ))}

              {/* Events */}
              <div className="absolute inset-0">
                {events.map((event) => {
                  const position = calculateEventPosition(
                    event.startTime,
                    event.endTime,
                    event.day
                  );

                  const isSmallEvent = position.heightPercent < 15;
                  const titleTextSize = isSmallEvent ? "text-xs" : "text-sm";
                  const detailsTextSize = isSmallEvent
                    ? "text-[10px]"
                    : "text-xs";

                  return (
                    <div
                      key={event.id}
                      className={`absolute ${event.color} text-white rounded-md overflow-hidden flex flex-col shadow-lg group transition-all duration-200 hover:scale-[1.02] hover:z-10`}
                      style={{
                        top: position.top,
                        height: position.height,
                        left: position.left,
                        width: position.width,
                        margin: "4px", // Increased margin for better spacing
                      }}
                    >
                      {/* Attendance indicator */}
                      {event.attendance && (
                        <div
                          className={`h-1 ${getAttendanceColor(
                            event.attendance.status
                          )}`}
                        />
                      )}
                      <div className="flex-grow p-2">
                        <div className={`font-semibold ${titleTextSize}`}>
                          {event.title}
                        </div>
                        <div className={detailsTextSize}>
                          {event.instructor}
                        </div>
                      </div>
                      <div
                        className={`mt-auto ${detailsTextSize} opacity-80 px-2 pb-2`}
                      >
                        <div>{event.room}</div>
                        <div>{`${event.startTime} - ${event.endTime}`}</div>
                        {event.attendance?.status === "late" && (
                          <div className="text-yellow-300">
                            {event.attendance.minutes}m late
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm text-neutral-300 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span>Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span>Authorized Absence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTableGrid;
