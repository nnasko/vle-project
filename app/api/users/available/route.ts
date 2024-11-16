import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users except the current user
    const users = await prisma.user.findMany({
      where: {
        AND: [{ id: { not: currentUser.id } }, { isActive: true }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isActive: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching available users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
