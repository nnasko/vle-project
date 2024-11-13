// app/api/timetables/lessons/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      moduleId,
      cohortId,
      studentId,
      teacherId,
      topic,
      description,
      date,
      startTime,
      endTime,
      room,
      materials = [],
    } = await req.json();

    console.log("Received lesson data:", {
      moduleId,
      cohortId,
      studentId,
      teacherId,
      topic,
      description,
      date,
      startTime,
      endTime,
      room,
      materials,
    });

    // Validate required fields
    if (!topic || !room) {
      return NextResponse.json(
        { error: "Topic and room are required" },
        { status: 400 }
      );
    }

    // Find teacher record
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 400 });
    }

    // Parse dates
    const lessonDate = new Date(date);
    const lessonStartTime = new Date(`${date}T${startTime}`);
    const lessonEndTime = new Date(`${date}T${endTime}`);

    // Prepare create data with correct types
    const createData: any = {
      topic,
      description,
      teacherId: teacher.id,
      date: lessonDate,
      startTime: lessonStartTime,
      endTime: lessonEndTime,
      room,
      materials,
    };

    // Add optional relations only if they exist
    if (moduleId) {
      createData.moduleId = moduleId;
    }

    if (cohortId) {
      createData.cohortId = cohortId;
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: createData,
      include: {
        module: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    // Handle attendance records
    if (cohortId) {
      // Get all students in the cohort
      const studentsInCohort = await prisma.student.findMany({
        where: {
          cohortId,
        },
      });

      if (studentsInCohort.length > 0) {
        await prisma.attendance.createMany({
          data: studentsInCohort.map((student) => ({
            lessonId: lesson.id,
            studentId: student.id,
            status: "ABSENT",
          })),
        });
      }
    } else if (studentId) {
      // Find student record
      const student = await prisma.student.findFirst({
        where: {
          userId: studentId,
        },
      });

      if (student) {
        await prisma.attendance.create({
          data: {
            lessonId: lesson.id,
            studentId: student.id,
            status: "ABSENT",
          },
        });
      }
    }

    // Get the created lesson with all related data
    const createdLesson = await prisma.lesson.findUnique({
      where: {
        id: lesson.id,
      },
      include: {
        module: true,
        teacher: {
          include: {
            user: true,
          },
        },
        attendance: true,
      },
    });

    if (!createdLesson) {
      throw new Error("Failed to retrieve created lesson");
    }

    // Transform to event response
    const eventResponse = {
      id: createdLesson.id,
      title: createdLesson.module?.name || createdLesson.topic,
      instructor: createdLesson.teacher.user.name,
      day: lessonDate
        .toLocaleString("en-US", { weekday: "short" })
        .toUpperCase(),
      startTime: lessonStartTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      endTime: lessonEndTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      room: createdLesson.room,
      color: "bg-indigo-600",
      moduleId: createdLesson.moduleId,
      cohortId: createdLesson.cohortId,
    };

    return NextResponse.json(eventResponse);
  } catch (error) {
    console.error("Failed to create lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
