// app/api/messages/unread/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unreadCounts = await prisma.message.groupBy({
      by: ["senderId"],
      where: {
        receiverId: user.id,
        read: false,
      },
      _count: true,
    });

    return NextResponse.json(unreadCounts);
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread counts" },
      { status: 500 }
    );
  }
}
