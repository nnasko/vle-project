// services/messageService.ts
import { useEffect, useState } from "react";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isActive: boolean;
}

export interface MessageWithUsers {
  id: string;
  subject: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: UserInfo;
  receiver: UserInfo;
}

export interface ThreadParticipant extends UserInfo {
  lastActive?: string;
  unreadCount?: number;
  status: "online" | "offline" | "away";
}

export interface Thread {
  participant: ThreadParticipant;
  messages: MessageWithUsers[];
  lastMessage?: MessageWithUsers;
}

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}

class MessageService {
  async getThreads(): Promise<Thread[]> {
    const response = await fetch("/api/messages");
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const messages: MessageWithUsers[] = await response.json();

    // Get current user for comparison
    const userResponse = await fetch("/api/user");
    if (!userResponse.ok) {
      throw new Error("Failed to fetch current user");
    }
    const currentUser = await userResponse.json();

    // Group messages by conversation participants
    const threads = new Map<string, Thread>();

    messages.forEach((message) => {
      const otherUser =
        message.senderId === currentUser.id ? message.receiver : message.sender;

      if (!threads.has(otherUser.id)) {
        threads.set(otherUser.id, {
          participant: {
            ...otherUser,
            status: otherUser.isActive ? "online" : "offline",
            lastActive: new Date(message.createdAt).toLocaleString(),
          },
          messages: [],
        });
      }

      const thread = threads.get(otherUser.id)!;
      thread.messages.push(message);

      // Sort messages by date (older to newer for display)
      thread.messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Set last message as the newest message
      thread.lastMessage = thread.messages[thread.messages.length - 1];

      // Calculate unread count
      thread.participant.unreadCount = thread.messages.filter(
        (m) => !m.read && m.senderId === otherUser.id
      ).length;
    });

    // Sort threads by last message date (newest first)
    return Array.from(threads.values()).sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || 0).getTime() -
        new Date(a.lastMessage?.createdAt || 0).getTime()
    );
  }

  async sendMessage(
    receiverId: string,
    subject: string,
    content: string
  ): Promise<MessageWithUsers> {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverId, subject, content }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  }

  async markAsRead(messageId: string): Promise<MessageWithUsers> {
    const response = await fetch(`/api/messages/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: true }),
    });

    if (!response.ok) {
      throw new Error("Failed to mark message as read");
    }

    return response.json();
  }

  async getUnreadCounts(): Promise<Record<string, number>> {
    const response = await fetch("/api/messages/unread");
    if (!response.ok) {
      throw new Error("Failed to fetch unread counts");
    }

    return response.json();
  }

  async deleteThread(participantId: string): Promise<void> {
    const response = await fetch(`/api/messages/thread/${participantId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete thread");
    }
  }

  // Helper method to mark all unread messages in a thread as read
  async markThreadAsRead(messages: MessageWithUsers[]): Promise<void> {
    // Mark all messages as read in parallel
    await Promise.all(messages.map((message) => this.markAsRead(message.id)));
  }
}

export const messageService = new MessageService();
