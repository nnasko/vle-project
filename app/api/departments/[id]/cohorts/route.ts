// app/api/departments/[id]/cohorts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, teacherId, startDate, endDate, maxStudents } = body;

    // Verify the teacher belongs to this department
    const teacher = await prisma.teacher.findFirst({
      where: {
        id: teacherId,
        departmentId: params.id,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found in this department" },
        { status: 404 }
      );
    }

    // Create the cohort
    const cohort = await prisma.cohort.create({
      data: {
        name,
        teacherId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxStudents: parseInt(maxStudents),
        department: {
          connect: {
            id: params.id,
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
        department: true,
      },
    });

    return NextResponse.json(cohort, { status: 201 });
  } catch (error) {
    console.error("Error creating cohort:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
