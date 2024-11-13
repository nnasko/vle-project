// /app/api/timetables/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");
  const departmentId = searchParams.get("departmentId");

  try {
    if (userId) {
      // Get user's timetable
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: {
            include: {
              cohort: true,
            },
          },
          teacherProfile: {
            include: {
              teachingModules: {
                include: {
                  module: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      let lessons;
      if (user.role === "STUDENT" && user.studentProfile?.cohort) {
        // Get lessons for student's cohort
        lessons = await prisma.lesson.findMany({
          where: {
            cohortId: user.studentProfile.cohort.id,
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
                studentId: user.studentProfile.id,
              },
            },
          },
        });
      } else if (user.role === "TEACHER") {
        // Get lessons taught by teacher
        lessons = await prisma.lesson.findMany({
          where: {
            teacherId: user.teacherProfile?.id,
          },
          include: {
            module: true,
            cohort: true,
          },
        });
      }

      return NextResponse.json({ user, lessons });
    }

    // Get filtered users list
    const users = await prisma.user.findMany({
      where: {
        role: role as "STUDENT" | "TEACHER" | undefined,
        AND: [
          {
            OR: [
              {
                studentProfile: {
                  cohort: {
                    department: {
                      id: departmentId || undefined,
                    },
                  },
                },
              },
              {
                teacherProfile: {
                  department: {
                    id: departmentId || undefined,
                  },
                },
              },
            ],
          },
        ],
      },
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
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch timetable data" },
      { status: 500 }
    );
  }
}
