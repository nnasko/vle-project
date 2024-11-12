// app/api/departments/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        teachers: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
            teachingModules: {
              include: {
                module: {
                  select: {
                    code: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        modules: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            year: true,
            credits: true,
            status: true,
          },
        },
        cohorts: {
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
            students: true,
          },
        },
        enrollmentTrends: {
          orderBy: {
            month: "asc",
          },
          take: 6,
        },
        attendanceRates: {
          orderBy: {
            week: "asc",
          },
          take: 6,
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
