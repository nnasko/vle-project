import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format, startOfWeek, endOfWeek } from "date-fns";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Get current week's start and end dates
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            cohort: {
              include: {
                teacher: {
                  include: {
                    user: true,
                  },
                },
                lessons: {
                  where: {
                    date: {
                      gte: currentWeekStart,
                      lte: currentWeekEnd,
                    },
                  },
                  include: {
                    module: true,
                    teacher: {
                      include: {
                        user: true,
                      },
                    },
                    attendance: {
                      where: {
                        student: {
                          userId: userId,
                        },
                      },
                    },
                  },
                },
              },
            },
            attendance: {
              where: {
                lesson: {
                  date: {
                    gte: currentWeekStart,
                    lte: currentWeekEnd,
                  },
                },
              },
            },
          },
        },
        teacherProfile: {
          include: {
            department: true,
            lessons: {
              where: {
                date: {
                  gte: currentWeekStart,
                  lte: currentWeekEnd,
                },
              },
              include: {
                module: true,
                cohort: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate attendance stats for current week only
    let attendanceStats = {
      total: 0,
      present: 0,
      late: 0,
      authorizedAbsence: 0,
      unauthorizedAbsence: 0,
      averageLateness: 0,
    };

    let events = [];

    // Extract cohort information
    const cohort = user.studentProfile?.cohort;

    if (user.role === "STUDENT" && cohort) {
      const attendance = user.studentProfile!.attendance;
      const totalLateMinutes = attendance
        .filter((a) => a.status === "LATE")
        .reduce((sum, a) => sum + (a.minutesLate || 0), 0);

      attendanceStats = {
        total: attendance.length,
        present: attendance.filter((a) => a.status === "PRESENT").length,
        late: attendance.filter((a) => a.status === "LATE").length,
        authorizedAbsence: attendance.filter((a) => a.status === "AUTHORIZED")
          .length,
        unauthorizedAbsence: attendance.filter((a) => a.status === "ABSENT")
          .length,
        averageLateness:
          attendance.filter((a) => a.status === "LATE").length > 0
            ? Math.round(
                totalLateMinutes /
                  attendance.filter((a) => a.status === "LATE").length
              )
            : 0,
      };

      events = cohort.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.topic,
        instructor: lesson.teacher.user.name,
        day: format(lesson.date, "EEE").toUpperCase(),
        startTime: format(lesson.startTime, "HH:mm"),
        endTime: format(lesson.endTime, "HH:mm"),
        room: lesson.room,
        color: "bg-indigo-600",
        moduleId: lesson.moduleId,
        cohortId: lesson.cohortId,
        attendance: lesson.attendance[0]
          ? {
              status: lesson.attendance[0].status,
              minutes: lesson.attendance[0].minutesLate,
            }
          : undefined,
      }));
    } else if (user.role === "TEACHER" && user.teacherProfile) {
      events = user.teacherProfile.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.topic,
        instructor: user.name,
        day: format(lesson.date, "EEE").toUpperCase(),
        startTime: format(lesson.startTime, "HH:mm"),
        endTime: format(lesson.endTime, "HH:mm"),
        room: lesson.room,
        color: "bg-indigo-600",
        moduleId: lesson.moduleId,
        cohortId: lesson.cohortId,
      }));
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        departmentId:
          user.studentProfile?.cohort?.departmentId ||
          user.teacherProfile?.departmentId,
        // Include full cohort information for students
        cohort:
          user.role === "STUDENT" && cohort
            ? {
                id: cohort.id,
                name: cohort.name,
                teacher: cohort.teacher
                  ? {
                      id: cohort.teacher.id,
                      user: {
                        id: cohort.teacher.user.id,
                        name: cohort.teacher.user.name,
                      },
                    }
                  : null,
              }
            : null,
        attendance: attendanceStats,
      },
      events,
      weekInfo: {
        start: currentWeekStart,
        end: currentWeekEnd,
        weekNumber: format(currentWeekStart, "w"),
      },
    });
  } catch (error) {
    console.error("Failed to fetch user timetable:", error);
    return NextResponse.json(
      { error: "Failed to fetch user timetable" },
      { status: 500 }
    );
  }
}
