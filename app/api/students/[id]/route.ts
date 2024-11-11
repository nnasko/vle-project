// File: app/api/students/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, currentGrade, cohortId } = body;

    const updatedStudent = await prisma.$transaction(async (prisma) => {
      const student = await prisma.student.findUnique({
        where: { id: params.id },
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
          email,
          phone,
        },
      });

      // Update student information
      return prisma.student.update({
        where: { id: params.id },
        data: {
          currentGrade,
          cohortId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              avatar: true,
              isActive: true,
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
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
