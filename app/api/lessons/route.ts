// /app/api/lessons/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      moduleId,
      cohortId,
      teacherId,
      topic,
      description,
      date,
      startTime,
      endTime,
      room,
      materials,
    } = body;

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        cohortId,
        teacherId,
        topic,
        description,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        room,
        materials,
      },
      include: {
        module: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    // Get all students in the cohort to create attendance records
    const studentsInCohort = await prisma.student.findMany({
      where: {
        cohortId,
      },
    });

    // Create attendance records for all students
    await prisma.attendance.createMany({
      data: studentsInCohort.map((student) => ({
        lessonId: lesson.id,
        studentId: student.id,
        status: "ABSENT", // Default status
      })),
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
