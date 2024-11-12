// app/api/students/[id]/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

enum LogType {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  BEHAVIOUR = "BEHAVIOUR",
  ACADEMIC = "ACADEMIC",
  ATTENDANCE = "ATTENDANCE",
  OTHER = "OTHER",
}

export async function POST(
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

    // Validate the type
    if (!Object.values(LogType).includes(body.type)) {
      return NextResponse.json({ error: "Invalid log type" }, { status: 400 });
    }

    // Create the log
    const log = await prisma.studentLog.create({
      data: {
        type: body.type,
        title: body.title,
        description: body.description,
        studentId: studentId,
        teacherId: body.teacherId,
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

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = params.id;
    const logs = await prisma.studentLog.findMany({
      where: {
        studentId: studentId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
