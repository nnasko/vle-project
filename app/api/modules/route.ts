// app/api/modules/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      code,
      description,
      year,
      credits,
      departmentId,
      learningOutcomes,
      topics,
      teacherIds,
    } = body;

    // Create the module and its relationships in a transaction
    const modulee = await prisma.$transaction(async (prisma) => {
      // Create the module
      const newModule = await prisma.module.create({
        data: {
          name,
          code,
          description,
          year,
          credits,
          status: "ACTIVE",
          department: {
            connect: { id: departmentId },
          },
          // Create learning outcomes if provided
          learningOutcomes: learningOutcomes
            ? {
                create: learningOutcomes.map((outcome: string) => ({
                  description: outcome,
                })),
              }
            : undefined,
          // Create topics if provided
          topics: topics
            ? {
                create: topics.map((topic: string) => ({
                  name: topic,
                })),
              }
            : undefined,
        },
        include: {
          learningOutcomes: true,
          topics: true,
        },
      });

      // If teacher IDs are provided, create the teacher-module relationships
      if (teacherIds && teacherIds.length > 0) {
        await Promise.all(
          teacherIds.map((teacherId: string) =>
            prisma.teacherModule.create({
              data: {
                teacherId,
                moduleId: newModule.id,
                startDate: new Date(),
              },
            })
          )
        );
      }

      return newModule;
    });

    return NextResponse.json(modulee, { status: 201 });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("id");

    if (!moduleId) {
      return NextResponse.json(
        { error: "Module ID is required" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the module and its relationships
    await prisma.$transaction([
      prisma.learningOutcome.deleteMany({
        where: { moduleId },
      }),
      prisma.topic.deleteMany({
        where: { moduleId },
      }),
      prisma.teacherModule.deleteMany({
        where: { moduleId },
      }),
      prisma.module.delete({
        where: { id: moduleId },
      }),
    ]);

    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json(
      { error: "Failed to delete module" },
      { status: 500 }
    );
  }
}
