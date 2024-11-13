// app/api/timetables/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfWeek, endOfWeek } from "date-fns";
import { validateRequest } from "@/lib/auth";
import type {
  User,
  Student,
  Teacher,
  Lesson,
  Attendance,
  AttendanceStatus,
} from "@prisma/client";
import type { TimetableEvent, AttendanceStats } from "@/types/department";

interface DbAttendance extends Attendance {
  minutesLate: number | null;
  status: AttendanceStatus;
}

type UserWithProfiles = User & {
  studentProfile?:
    | (Student & {
        attendance: Attendance[];
        cohort?: {
          departmentId: string;
          lessons: (Lesson & {
            module?: { name: string };
            teacher: Teacher & { user: User };
            attendance: Attendance[];
          })[];
        };
      })
    | null;
  teacherProfile?:
    | (Teacher & {
        departmentId: string;
        lessons: (Lesson & {
          module?: { name: string };
          attendance: Attendance[];
        })[];
      })
    | null;
};

export async function GET(req: Request) {
  try {
    const authUser = await validateRequest();
    if (authUser instanceof NextResponse) {
      return authUser;
    }

    const { searchParams } = new URL(req.url);
    const weekStart = searchParams.get("weekStart")
      ? new Date(searchParams.get("weekStart"))
      : new Date();

    const startDate = startOfWeek(weekStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(weekStart, { weekStartsOn: 1 });

    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    const departmentId = searchParams.get("departmentId");

    // If userId is provided, get specific user's timetable
    if (userId || (!role && !departmentId)) {
      const targetUserId = userId || authUser.id;

      const user = (await prisma.user.findUnique({
        where: { id: targetUserId as string },
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
                            userId: targetUserId,
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
      })) as UserWithProfiles;

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      let attendanceStats: AttendanceStats = {
        total: 0,
        present: 0,
        late: 0,
        authorizedAbsence: 0,
        unauthorizedAbsence: 0,
        averageLateness: 0,
      };

      let events: TimetableEvent[] = [];

      if (user.role === "STUDENT" && user.studentProfile?.cohort) {
        const attendance = user.studentProfile.attendance as DbAttendance[];
        const lateAttendances = attendance.filter((a) => a.status === "LATE");

        const totalLateMinutes = lateAttendances.reduce(
          (sum, a) => sum + (a.minutesLate ?? 0),
          0
        );

        attendanceStats = {
          total: attendance.length,
          present: attendance.filter((a) => a.status === "PRESENT").length,
          late: lateAttendances.length,
          authorizedAbsence: attendance.filter((a) => a.status === "AUTHORIZED")
            .length,
          unauthorizedAbsence: attendance.filter((a) => a.status === "ABSENT")
            .length,
          averageLateness:
            lateAttendances.length > 0
              ? Math.round(totalLateMinutes / lateAttendances.length)
              : 0,
        };

        events = user.studentProfile.cohort.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.module?.name ?? lesson.topic,
          instructor: lesson.teacher.user.name,
          day: new Date(lesson.date)
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase(),
          startTime: new Date(lesson.startTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          endTime: new Date(lesson.endTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          room: lesson.room,
          color: "bg-indigo-600",
          moduleId: lesson.moduleId ?? "",
          cohortId: lesson.cohortId,
          attendance: lesson.attendance[0]
            ? {
                status: lesson.attendance[0].status,
                minutes: lesson.attendance[0].minutesLate ?? undefined,
              }
            : undefined,
        }));
      } else if (user.role === "TEACHER" && user.teacherProfile) {
        events = user.teacherProfile.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.module?.name ?? lesson.topic,
          instructor: user.name,
          day: new Date(lesson.date)
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase(),
          startTime: new Date(lesson.startTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          endTime: new Date(lesson.endTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          room: lesson.room,
          color: "bg-indigo-600",
          moduleId: lesson.moduleId ?? "",
          cohortId: lesson.cohortId,
          attendanceSummary: {
            total: lesson.attendance.length,
            present: lesson.attendance.filter((a) => a.status === "PRESENT")
              .length,
            late: lesson.attendance.filter((a) => a.status === "LATE").length,
            absent: lesson.attendance.filter((a) => a.status === "ABSENT")
              .length,
            authorized: lesson.attendance.filter(
              (a) => a.status === "AUTHORIZED"
            ).length,
          },
        }));

        const allAttendance = user.teacherProfile.lessons.flatMap(
          (l) => l.attendance
        ) as DbAttendance[];

        const lateAttendances = allAttendance.filter(
          (a) => a.status === "LATE"
        );

        attendanceStats = {
          total: allAttendance.length,
          present: allAttendance.filter((a) => a.status === "PRESENT").length,
          late: lateAttendances.length,
          authorizedAbsence: allAttendance.filter(
            (a) => a.status === "AUTHORIZED"
          ).length,
          unauthorizedAbsence: allAttendance.filter(
            (a) => a.status === "ABSENT"
          ).length,
          averageLateness:
            lateAttendances.length > 0
              ? Math.round(
                  lateAttendances.reduce(
                    (sum, a) => sum + (a.minutesLate ?? 0),
                    0
                  ) / lateAttendances.length
                )
              : 0,
        };
      }

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          departmentId:
            user.studentProfile?.cohort?.departmentId ??
            user.teacherProfile?.departmentId,
          cohortId: user.studentProfile?.cohortId,
          attendance: attendanceStats,
        },
        events,
        weekInfo: {
          start: startDate,
          end: endDate,
        },
      });
    }

    // If no userId, get filtered users list
    const whereClause: any = {};

    if (role && role !== "all") {
      whereClause.role = role;
    }

    if (departmentId && departmentId !== "all") {
      whereClause.AND = [
        {
          OR: [
            {
              studentProfile: {
                cohort: {
                  departmentId,
                },
              },
            },
            {
              teacherProfile: {
                departmentId,
              },
            },
          ],
        },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        studentProfile: {
          include: {
            cohort: {
              include: {
                department: true,
              },
            },
          },
        },
        teacherProfile: {
          include: {
            department: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch timetable data:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable data" },
      { status: 500 }
    );
  }
}
