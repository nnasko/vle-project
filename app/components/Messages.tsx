"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Send,
  Clock,
  Home as HomeIcon,
  MoreVertical,
  Trash2,
  Home,
} from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  avatar: string;
  lastActive: string;
  unreadCount?: number;
  status: "online" | "offline" | "away";
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Thread {
  userId: number;
  messages: Message[];
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Atanas Kyurchiev",
    avatar: "/api/placeholder/32/32",
    lastActive: "2 minutes ago",
    unreadCount: 3,
    status: "online",
  },
  {
    id: 2,
    name: "Joseph Mitsi",
    avatar: "/api/placeholder/32/32",
    lastActive: "5 minutes ago",
    status: "online",
  },
  {
    id: 3,
    name: "Oliver Witmond-Harris",
    avatar: "/api/placeholder/32/32",
    lastActive: "25 minutes ago",
    unreadCount: 1,
    status: "away",
  },
  {
    id: 4,
    name: "Jack Ames",
    avatar: "/api/placeholder/32/32",
    lastActive: "1 hour ago",
    status: "offline",
  },
  {
    id: 5,
    name: "Luke Wilson",
    avatar: "/api/placeholder/32/32",
    lastActive: "3 hours ago",
    status: "offline",
  },
];

const mockThreads: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderId: 1,
      receiverId: 0,
      content: "Hey, how's your progress with the React assignment?",
      timestamp: "2024-03-20T10:30:00",
      read: true,
    },
    {
      id: 2,
      senderId: 0,
      receiverId: 1,
      content: "Going well! Just working on the final touches.",
      timestamp: "2024-03-20T10:32:00",
      read: true,
    },
    {
      id: 3,
      senderId: 1,
      receiverId: 0,
      content: "Great! Let me know if you need any help.",
      timestamp: "2024-03-20T10:33:00",
      read: false,
    },
  ],
  3: [
    {
      id: 4,
      senderId: 3,
      receiverId: 0,
      content: "Could you help me with the database assignment?",
      timestamp: "2024-03-20T09:15:00",
      read: false,
    },
  ],
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return "Just now";
  }
};

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [threads, setThreads] = useState(mockThreads);
  const [availableUsers, setAvailableUsers] = useState(mockUsers);

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentThread = selectedUser ? threads[selectedUser.id] || [] : [];

  const handleSendMessage = () => {
    if (!selectedUser || !newMessage.trim()) return;

    const newThreadMessage: Message = {
      id:
        Math.max(
          ...Object.values(threads)
            .flat()
            .map((m) => m.id),
          0
        ) + 1,
      senderId: 0,
      receiverId: selectedUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setThreads((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newThreadMessage],
    }));

    setNewMessage("");
  };

  const handleDeleteChat = (userId: number) => {
    setThreads((prev) => {
      const newThreads = { ...prev };
      delete newThreads[userId];
      return newThreads;
    });

    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb className="mb-6 p-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <BreadcrumbLink asChild>
                <Link href="/messages">Messages</Link>
              </BreadcrumbLink>
            </BreadcrumbPage>
          </BreadcrumbItem>
          {selectedUser && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedUser.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 container mx-auto">
        {/* Breadcrumbs */}

        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold"> MESSAGES</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-main hover:bg-second">
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <Input placeholder="Type your message..." />
                  <Button className="w-full">Send Message</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-neutral-800 rounded-lg h-[calc(100vh-200px)]">
          <div className="grid grid-cols-3 gap-6 h-full">
            {/* Users List */}
            <div className="col-span-1 border-r border-neutral-700 p-6">
              <div className="h-full flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-neutral-700"
                          : "hover:bg-neutral-700"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-800 ${
                              user.status === "online"
                                ? "bg-green-500"
                                : user.status === "away"
                                ? "bg-yellow-500"
                                : "bg-neutral-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white truncate">
                              {user.name}
                              {user.unreadCount && (
                                <span className="bg-main text-white text-xs px-2 mx-2 py-1 rounded-full">
                                  {user.unreadCount}
                                </span>
                              )}
                            </p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-neutral-800"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4 text-white" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="">
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChat(user.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Chat
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-neutral-400">
                              <Clock className="w-3 h-3" />
                              <span>{user.lastActive}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="col-span-2 p-6">
              {selectedUser ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-4">
                      {currentThread.map((message) => {
                        const isSentByMe = message.senderId === 0;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isSentByMe ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] ${
                                isSentByMe
                                  ? "bg-main text-white"
                                  : "bg-neutral-700 text-white"
                              } rounded-lg p-3`}
                            >
                              <p>{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {formatTimestamp(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      className="bg-main hover:bg-second"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-400">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
