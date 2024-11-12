// app/api/notifications/unread-count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
