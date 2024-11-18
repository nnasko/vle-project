// components/TimeTableGrid.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  UserCheck,
  Clock,
  Users,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import {
  AttendanceStats,
  TimetableEvent,
  AttendanceStatus,
} from "@/types/department";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface TimeTableGridProps {
  userId?: string;
  userName?: string;
  events: TimetableEvent[];
  isTeacher?: boolean;
  attendanceStats: AttendanceStats;
  onWeekChange: (date: Date) => void;
}

export const TimeTableGrid: React.FC<TimeTableGridProps> = ({
  userName,
  events = [],
  attendanceStats,
  onWeekChange,
}) => {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  const handleWeekChange = (date: Date) => {
    setSelectedDate(date);
    onWeekChange(date);
    setCalendarOpen(false);
  };

  const handlePreviousWeek = () => {
    const newDate = subWeeks(selectedDate, 1);
    handleWeekChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(selectedDate, 1);
    handleWeekChange(newDate);
  };

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
      case "PRESENT":
        return "bg-emerald-500";
      case "LATE":
        return "bg-yellow-500";
      case "ABSENT":
        return "bg-red-500";
      case "AUTHORIZED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="overflow-auto">
        <span className="text-2xl font-bold pb-4">TIMETABLE</span>
        <div className="bg-neutral-700 rounded-md p-4">
          {/* Attendance Overview */}
          <Card className="bg-neutral-700 border-2 border-second">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
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
          <div className="bg-neutral-700 p-4 rounded-lg flex justify-between items-center gap-4 mt-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white">
                {userName ? `${userName}'s Timetable` : "Your Timetable"}
              </h2>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousWeek}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal"
                      )}
                    >
                      Week {format(weekStart, "d MMM")} -{" "}
                      {format(weekEnd, "d MMM, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && handleWeekChange(date)}
                      disabled={(date) =>
                        date > addWeeks(new Date(), 4) ||
                        date < subWeeks(new Date(), 52)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextWeek}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="bg-neutral-700 p-6 rounded-lg mt-4">
            <div className="relative h-[640px] rounded-lg overflow-hidden">
              {/* Time labels */}
              <div className="absolute left-0 top-12 w-16 h-[calc(100%-48px)] border-r border-second bg-neutral-700 z-20">
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
              <div className="absolute left-0 right-0 top-0 h-12 border-b border-second flex bg-neutral-700 z-10">
                <div className="w-16 border-r border-second" />
                {days.map((day) => (
                  <div
                    key={day}
                    className="flex-1 text-center font-bold py-3 border-r border-second last:border-r-0 text-gray-300"
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
                    className="absolute top-0 bottom-0 border-r border-second"
                    style={{ left: `${(i * 100) / 5}%` }}
                  />
                ))}

                {/* Horizontal lines */}
                {timeSlots.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-b border-second"
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
                          margin: "4px",
                        }}
                      >
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
                          {event.attendance?.status === "LATE" && (
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
    </div>
  );
};

export default TimeTableGrid;
