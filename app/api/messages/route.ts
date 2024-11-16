import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Get all messages for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const threads = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isActive: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, subject, content } = await request.json();

    const message = await prisma.message.create({
      data: {
        subject,
        content,
        senderId: user.id,
        receiverId,
        read: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isActive: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
