// app/api/departments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
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
          },
        },
        modules: true,
        cohorts: {
          include: {
            students: true,
          },
        },
      },
    });

    const formattedDepartments = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      code: dept.code,
      head: dept.headOfDepartment,
      description: dept.description,
      duration: dept.duration,
      staffCount: dept.staffCount,
      studentCount: dept.studentCount,
      modules: dept.modules.map((module) => ({
        id: module.id,
        name: module.name,
        code: module.code,
      })),
      status: dept.status,
      cohorts: dept.cohorts.map((cohort) => ({
        id: cohort.id,
        name: cohort.name,
        studentCount: cohort.currentStudents,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
      })),
    }));

    return NextResponse.json(formattedDepartments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, description, headOfDepartment, duration } = body;

    const department = await prisma.department.create({
      data: {
        name,
        code,
        description,
        headOfDepartment,
        duration: duration || "FULL_TIME",
        status: "active",
        isActive: true,
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
