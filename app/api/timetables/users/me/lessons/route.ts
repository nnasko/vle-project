// app/api/timetables/users/me/lessons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get week start from query params
    const { searchParams } = new URL(request.url);
    const weekStartParam = searchParams.get("weekStart");

    if (!weekStartParam) {
      return NextResponse.json(
        { error: "weekStart is required" },
        { status: 400 }
      );
    }

    const weekStart = startOfWeek(new Date(weekStartParam), {
      weekStartsOn: 1,
    });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    // Different queries based on user role
    let lessons;
    switch (user.role) {
      case "STUDENT":
        lessons = await prisma.lesson.findMany({
          where: {
            date: {
              gte: weekStart,
              lte: weekEnd,
            },
            cohort: {
              students: {
                some: {
                  userId: user.id,
                },
              },
            },
          },
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            attendanceRecords: {
              where: {
                studentId: user.id,
              },
            },
            module: {
              select: {
                name: true,
                code: true,
              },
            },
          },
          orderBy: {
            date: "asc",
          },
        });
        break;

      case "TEACHER":
        lessons = await prisma.lesson.findMany({
          where: {
            date: {
              gte: weekStart,
              lte: weekEnd,
            },
            teacherId: user.id,
          },
          include: {
            attendanceRecords: true,
            module: {
              select: {
                name: true,
                code: true,
              },
            },
          },
          orderBy: {
            date: "asc",
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    // Transform lessons into timetable events
    const events = lessons.map((lesson) => {
      const date = new Date(lesson.date);
      const day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
        date.getDay()
      ];

      return {
        id: lesson.id,
        title: `${lesson.module.code}: ${lesson.module.name}`,
        instructor: lesson.teacher?.user.name || "TBA",
        day,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        room: lesson.room,
        color: "bg-blue-500/80",
        attendance: lesson.attendanceRecords[0]
          ? {
              status: lesson.attendanceRecords[0].status,
              minutes: lesson.attendanceRecords[0].lateMinutes,
            }
          : undefined,
      };
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
