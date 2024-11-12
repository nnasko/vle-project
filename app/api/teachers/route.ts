import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
