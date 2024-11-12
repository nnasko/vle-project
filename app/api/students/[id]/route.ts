// app/api/students/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = params.id;
    const body = await request.json();
    const { name, phone, currentGrade, cohortId } = body;

    // Update student and user information in a transaction
    const updatedStudent = await prisma.$transaction(async (prisma) => {
      // First get the student to get their userId
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { userId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      // Update user information
      await prisma.user.update({
        where: { id: student.userId },
        data: {
          name,
          phone,
        },
      });

      // Update student information
      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: {
          currentGrade,
          ...(cohortId ? { cohortId } : {}),
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              avatar: true,
              isActive: true,
              joinDate: true,
            },
          },
          cohort: {
            select: {
              name: true,
              course: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return updatedStudent;
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    if (error instanceof Error && error.message === "Student not found") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
