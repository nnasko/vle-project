// app/api/cohorts/[id]/teachers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cohortId = params.id;
    const { teacherId } = await request.json();

    // Verify the teacher exists and belongs to the same department as the cohort
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId },
      include: { department: true },
    });

    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { department: true },
    });

    if (!teacher || teacher.departmentId !== cohort.departmentId) {
      return NextResponse.json(
        { error: "Invalid teacher selection" },
        { status: 400 }
      );
    }

    // Update the cohort with the new teacher
    const updatedCohort = await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        teacher: {
          connect: { id: teacherId },
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
      },
    });

    return NextResponse.json(updatedCohort);
  } catch (error) {
    console.error("Error assigning teacher:", error);
    return NextResponse.json(
      { error: "Failed to assign teacher" },
      { status: 500 }
    );
  }
}
