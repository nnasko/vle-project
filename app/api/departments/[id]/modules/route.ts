// app/api/departments/[id]/modules/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      description,
      year,
      credits,
      status,
      learningOutcomes,
      topics,
    } = body;

    // Create the module with nested relations
    const modulee = await prisma.module.create({
      data: {
        name,
        code,
        description,
        year,
        credits,
        status: status || "ACTIVE",
        department: {
          connect: {
            id: params.id,
          },
        },
        learningOutcomes: learningOutcomes
          ? {
              create: learningOutcomes.map((desc: string) => ({
                description: desc,
              })),
            }
          : undefined,
        topics: topics
          ? {
              create: topics.map((name: string) => ({
                name,
              })),
            }
          : undefined,
      },
      include: {
        learningOutcomes: true,
        topics: true,
        teachers: {
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
        },
      },
    });

    return NextResponse.json(modulee, { status: 201 });
  } catch (error) {
    console.error("Error creating module:", error);
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
    const modules = await prisma.module.findMany({
      where: {
        departmentId: params.id,
      },
      include: {
        learningOutcomes: true,
        topics: true,
        teachers: {
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
        },
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
