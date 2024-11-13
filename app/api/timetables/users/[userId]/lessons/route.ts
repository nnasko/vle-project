import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { AttendanceStatus } from "@prisma/client";

interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  authorizedAbsence: number;
  unauthorizedAbsence: number;
  averageLateness: number;
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const weekStart = searchParams.get("weekStart");

    if (!weekStart) {
      return NextResponse.json(
        { error: "Week start date is required" },
        { status: 400 }
      );
    }

    const startDate = startOfWeek(new Date(weekStart), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(weekStart), { weekStartsOn: 1 });

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        studentProfile: {
          include: {
            cohort: {
              include: {
                lessons: {
                  where: {
                    date: {
                      gte: startDate,
                      lte: endDate,
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
                          userId: params.userId,
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
                    gte: startDate,
                    lte: endDate,
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
                  gte: startDate,
                  lte: endDate,
                },
              },
              include: {
                module: true,
                cohort: true,
                attendance: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate attendance stats for the week
    let attendanceStats: AttendanceStats = {
      total: 0,
      present: 0,
      late: 0,
      authorizedAbsence: 0,
      unauthorizedAbsence: 0,
      averageLateness: 0,
    };

    let events = [];

    if (user.role === "STUDENT" && user.studentProfile?.cohort) {
      const attendance = user.studentProfile.attendance;
      const totalLateMinutes = attendance
        .filter((a) => a.status === AttendanceStatus.LATE)
        .reduce((sum, a) => sum + (a.minutesLate || 0), 0);

      attendanceStats = {
        total: attendance.length,
        present: attendance.filter((a) => a.status === AttendanceStatus.PRESENT)
          .length,
        late: attendance.filter((a) => a.status === AttendanceStatus.LATE)
          .length,
        authorizedAbsence: attendance.filter(
          (a) => a.status === AttendanceStatus.AUTHORIZED
        ).length,
        unauthorizedAbsence: attendance.filter(
          (a) => a.status === AttendanceStatus.ABSENT
        ).length,
        averageLateness:
          attendance.filter((a) => a.status === AttendanceStatus.LATE).length >
          0
            ? Math.round(
                totalLateMinutes /
                  attendance.filter((a) => a.status === AttendanceStatus.LATE)
                    .length
              )
            : 0,
      };

      events = user.studentProfile.cohort.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.module?.name || lesson.topic,
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
      // For teachers, we'll show all their lessons but no attendance stats
      events = user.teacherProfile.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.module?.name || lesson.topic,
        instructor: user.name,
        day: format(lesson.date, "EEE").toUpperCase(),
        startTime: format(lesson.startTime, "HH:mm"),
        endTime: format(lesson.endTime, "HH:mm"),
        room: lesson.room,
        color: "bg-indigo-600",
        moduleId: lesson.moduleId,
        cohortId: lesson.cohortId,
        // For teachers, show class attendance summary
        attendanceSummary: {
          total: lesson.attendance.length,
          present: lesson.attendance.filter(
            (a) => a.status === AttendanceStatus.PRESENT
          ).length,
          late: lesson.attendance.filter(
            (a) => a.status === AttendanceStatus.LATE
          ).length,
          absent: lesson.attendance.filter(
            (a) => a.status === AttendanceStatus.ABSENT
          ).length,
          authorized: lesson.attendance.filter(
            (a) => a.status === AttendanceStatus.AUTHORIZED
          ).length,
        },
      }));

      // Calculate overall attendance stats for teacher's lessons this week
      const allAttendance = user.teacherProfile.lessons.flatMap(
        (l) => l.attendance
      );
      attendanceStats = {
        total: allAttendance.length,
        present: allAttendance.filter(
          (a) => a.status === AttendanceStatus.PRESENT
        ).length,
        late: allAttendance.filter((a) => a.status === AttendanceStatus.LATE)
          .length,
        authorizedAbsence: allAttendance.filter(
          (a) => a.status === AttendanceStatus.AUTHORIZED
        ).length,
        unauthorizedAbsence: allAttendance.filter(
          (a) => a.status === AttendanceStatus.ABSENT
        ).length,
        averageLateness: Math.round(
          allAttendance
            .filter((a) => a.status === AttendanceStatus.LATE)
            .reduce((sum, a) => sum + (a.minutesLate || 0), 0) /
            (allAttendance.filter((a) => a.status === AttendanceStatus.LATE)
              .length || 1)
        ),
      };
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
        cohortId: user.studentProfile?.cohortId,
        attendance: attendanceStats,
      },
      events,
      weekInfo: {
        start: startDate,
        end: endDate,
        weekNumber: format(startDate, "w"),
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
