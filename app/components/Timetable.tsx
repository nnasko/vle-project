"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";

interface Event {
  id: number;
  title: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
}

const TimeTableGrid = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Advanced Frameworks",
      instructor: "Owen Tasker",
      day: "MON",
      startTime: "09:00",
      endTime: "11:00",
      room: "Games Lab 3",
      color: "bg-indigo-600",
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
    },
  ]);

  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const [newEvent, setNewEvent] = useState<Omit<Event, "id" | "color">>({
    title: "",
    instructor: "",
    day: "",
    startTime: "",
    endTime: "",
    room: "",
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

    // Adjust width to account for margins
    const width = 19.6; // Slightly less than 20% to create gaps

    return {
      top: `${top}%`,
      height: `${height}%`,
      left: `${left}%`,
      width: `${width}%`,
      heightPercent: height,
    };
  };

  const handleAddEvent = () => {
    const newId = Math.max(...events.map((e) => e.id), 0) + 1;
    setEvents([
      ...events,
      {
        ...newEvent,
        id: newId,
        color: "bg-indigo-600",
      },
    ]);
    setNewEvent({
      title: "",
      instructor: "",
      day: "",
      startTime: "",
      endTime: "",
      room: "",
    });
  };
  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">YOUR TIMETABLE</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Instructor"
                  value={newEvent.instructor}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, instructor: e.target.value })
                  }
                />
                <Input
                  placeholder="Room"
                  value={newEvent.room}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, room: e.target.value })
                  }
                />
                <Select
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, day: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                />
                <Button onClick={handleAddEvent}>Add Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-neutral-800 p-8 rounded-lg">
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
                      className={`absolute ${event.color} text-white rounded overflow-hidden flex flex-col shadow-lg`}
                      style={{
                        top: position.top,
                        height: position.height,
                        left: position.left,
                        width: position.width,
                        margin: "2px", // Added margin for spacing
                      }}
                    >
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTableGrid;
