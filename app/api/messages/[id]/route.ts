import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
// app/api/messages/[id]/route.ts
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messageId = params.id;
    const { read } = await request.json();

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Only allow receiver to mark message as read
    if (message.receiverId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { read },
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

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
