import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with role-specific profile
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    // Create role-specific profile
    switch (role) {
      case "STUDENT":
        await prisma.student.create({
          data: {
            userId: user.id,
            studentId: `STU${Math.floor(Math.random() * 10000)}`,
            currentGrade: "FIRST_YEAR",
            expectedGraduation: new Date(
              new Date().setFullYear(new Date().getFullYear() + 4)
            ),
          },
        });
        break;

      case "TEACHER":
        await prisma.teacher.create({
          data: {
            userId: user.id,
            employeeId: `TCH${Math.floor(Math.random() * 10000)}`,
            position: "Lecturer",
            departmentId: body.departmentId,
          },
        });
        break;

      case "ADMIN":
        await prisma.admin.create({
          data: {
            userId: user.id,
            employeeId: `ADM${Math.floor(Math.random() * 10000)}`,
            role: "Administrator",
            departmentId: body.departmentId,
          },
        });
        break;
    }

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
