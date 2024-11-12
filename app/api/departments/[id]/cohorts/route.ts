import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, courseId, teacherId, startDate, endDate } = body;

    const cohort = await prisma.cohort.create({
      data: {
        name,
        courseId,
        teacherId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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
        course: true,
      },
    });

    return NextResponse.json(cohort, { status: 201 });
  } catch (error) {
    console.error("Error creating cohort:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
