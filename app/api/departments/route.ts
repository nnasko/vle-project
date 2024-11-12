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
        courses: {
          include: {
            modules: true,
          },
        },
        _count: {
          select: {
            teachers: true,
            courses: true,
          },
        },
      },
    });

    const formattedDepartments = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      head: dept.headOfDepartment,
      staffCount: dept._count.teachers,
      studentCount: 0, // You'll need to calculate this based on your data structure
      modules: dept.courses.flatMap((course) => course.modules),
      status: dept.isActive ? "active" : "inactive",
      description: dept.description,
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
    const { name, description, headOfDepartment } = body;

    const department = await prisma.department.create({
      data: {
        name,
        description,
        headOfDepartment,
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
