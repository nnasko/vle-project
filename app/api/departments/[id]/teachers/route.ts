// app/api/departments/[id]/teachers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      phone,
      position,
      specializations,
      qualifications,
      biography,
      officeHours,
    } = body;

    // Create user first
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        role: "TEACHER",
      },
    });

    // Create teacher profile
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        departmentId: params.id,
        employeeId: `TCH${Math.floor(Math.random() * 10000)}`,
        position,
        specializations,
        qualifications,
        biography,
        officeHours,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Update department staff count
    await prisma.department.update({
      where: { id: params.id },
      data: {
        staffCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
