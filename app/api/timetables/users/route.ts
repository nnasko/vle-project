// app/api/timetables/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const departmentId = searchParams.get("departmentId");

    // Build the where clause conditionally
    const whereClause: any = {};

    // Only add role filter if a specific role is selected
    if (role && role !== "all") {
      whereClause.role = role as UserRole;
    }

    // Only add department filter if a specific department is selected
    if (departmentId && departmentId !== "all") {
      whereClause.OR = [
        {
          studentProfile: {
            cohort: {
              departmentId: departmentId,
            },
          },
        },
        {
          teacherProfile: {
            departmentId: departmentId,
          },
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
                teacher: true,
              },
            },
            attendance: {
              include: {
                lesson: true,
              },
            },
          },
        },
        teacherProfile: {
          include: {
            department: true,
            lessons: true,
          },
        },
      },
    });

    // Transform users to include attendance stats
    const transformedUsers = users.map((user) => {
      // Calculate attendance stats
      let attendanceStats = {
        total: 0,
        present: 0,
        late: 0,
        authorizedAbsence: 0,
        unauthorizedAbsence: 0,
        averageLateness: 0,
      };

      if (user.studentProfile) {
        const attendance = user.studentProfile.attendance;
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
      }

      // Get department ID based on user role
      const departmentId =
        user.studentProfile?.cohort?.departmentId ||
        user.teacherProfile?.departmentId;

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        departmentId,
        cohortId: user.studentProfile?.cohortId,
        attendance: attendanceStats,
      };
    });

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
