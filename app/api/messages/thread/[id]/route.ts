import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const threadParticipantId = params.id;

    // Delete all messages between these users
    await prisma.message.deleteMany({
      where: {
        OR: [
          {
            AND: [{ senderId: user.id }, { receiverId: threadParticipantId }],
          },
          {
            AND: [{ senderId: threadParticipantId }, { receiverId: user.id }],
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}
