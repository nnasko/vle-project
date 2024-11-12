// app/api/students/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
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
        logs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            createdAt: true,
            teacher: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, password, currentGrade, cohortId } = body;

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create user and student profile in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      // Prepare student data
      const studentData = {
        userId: newUser.id,
        studentId: `STU${Math.floor(Math.random() * 100000)}`,
        currentGrade,
        expectedGraduation: new Date(
          new Date().setFullYear(new Date().getFullYear() + 4)
        ),
        ...(cohortId ? { cohortId } : {}), // Only include cohortId if provided
      };

      // Create student profile
      const student = await prisma.student.create({
        data: studentData,
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

      return student;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
