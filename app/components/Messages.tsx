"use client";
import React, { useState, useEffect, useRef } from "react";
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
  Home,
  MoreVertical,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { messageService, Thread } from "@/services/messageService";
import { toast } from "react-toastify";

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch("/api/users/available");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      setAvailableUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load available users");
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (selectedThread) {
      // Poll for new messages every 5 seconds for the active conversation
      pollInterval = setInterval(async () => {
        try {
          const updatedThreads = await messageService.getThreads();
          const updatedThread = updatedThreads.find(
            (t) => t.participant.id === selectedThread.participant.id
          );

          if (updatedThread) {
            // Update the selected thread with new messages
            setSelectedThread(updatedThread);

            // Update the threads list
            setThreads((prevThreads) =>
              prevThreads.map((thread) =>
                thread.participant.id === updatedThread.participant.id
                  ? updatedThread
                  : thread
              )
            );

            // If we're at the bottom, scroll to show new messages
            const container = messagesEndRef.current?.parentElement;
            if (container) {
              const isAtBottom =
                container.scrollHeight - container.scrollTop ===
                container.clientHeight;
              if (isAtBottom) {
                scrollToBottom();
              }
            }
          }
        } catch (error) {
          console.error("Error polling for messages:", error);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedThread?.participant.id]);

  useEffect(() => {
    if (dialogOpen) {
      fetchAvailableUsers();
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (selectedThread) {
      scrollToBottom();
    }
  }, [selectedThread?.messages]);

  const fetchThreads = async () => {
    try {
      const fetchedThreads = await messageService.getThreads();

      // Sort threads by last message timestamp
      const sortedThreads = fetchedThreads.sort((a, b) => {
        const aTime = a.lastMessage
          ? new Date(a.lastMessage.createdAt).getTime()
          : 0;
        const bTime = b.lastMessage
          ? new Date(b.lastMessage.createdAt).getTime()
          : 0;
        return bTime - aTime;
      });

      // Sort messages within each thread
      sortedThreads.forEach((thread) => {
        thread.messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      setThreads(sortedThreads);
    } catch (error) {
      toast.error("Failed to load messages");
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (participantId: string) => {
    const thread = threads.find((t) => t.participant.id === participantId);
    if (thread) {
      setSelectedThread(thread);
    } else {
      // Create new thread
      const newThread: Thread = {
        participant: {
          id: participantId,
          name: "New Chat",
          email: "",
          avatar: null,
          isActive: true,
          status: "offline",
        },
        messages: [],
      };
      setThreads((prev) => [...prev, newThread]);
      setSelectedThread(newThread);
    }
  };

  const handleThreadSelection = async (thread: Thread) => {
    setSelectedThread(thread);

    try {
      // Mark all unread messages as read
      const unreadMessages = thread.messages.filter(
        (msg) => !msg.read && msg.senderId === thread.participant.id
      );

      if (unreadMessages.length > 0) {
        await messageService.markThreadAsRead(unreadMessages);

        // Update local state to reflect read status
        setThreads((prevThreads) =>
          prevThreads.map((t) => {
            if (t.participant.id === thread.participant.id) {
              return {
                ...t,
                messages: t.messages.map((msg) => ({
                  ...msg,
                  read:
                    msg.senderId === thread.participant.id ? true : msg.read,
                })),
                participant: {
                  ...t.participant,
                  unreadCount: 0,
                },
              };
            }
            return t;
          })
        );

        // Update selected thread
        setSelectedThread((prevThread) => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            messages: prevThread.messages.map((msg) => ({
              ...msg,
              read: msg.senderId === thread.participant.id ? true : msg.read,
            })),
            participant: {
              ...prevThread.participant,
              unreadCount: 0,
            },
          };
        });
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedThread || !newMessage.trim()) return;

    setSending(true);
    try {
      const message = await messageService.sendMessage(
        selectedThread.participant.id,
        "New Message",
        newMessage.trim()
      );

      // Update threads state
      setThreads((prev) => {
        const updatedThreads = prev.map((thread) => {
          if (thread.participant.id === selectedThread.participant.id) {
            return {
              ...thread,
              messages: [...thread.messages, message],
              lastMessage: message,
            };
          }
          return thread;
        });

        // Sort threads by last message timestamp
        return updatedThreads.sort((a, b) => {
          const aTime = a.lastMessage
            ? new Date(a.lastMessage.createdAt).getTime()
            : 0;
          const bTime = b.lastMessage
            ? new Date(b.lastMessage.createdAt).getTime()
            : 0;
          return bTime - aTime;
        });
      });

      // Update selected thread
      setSelectedThread((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, message],
          lastMessage: message,
        };
      });

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await messageService.deleteThread(threadId);
      setThreads((prev) => prev.filter((t) => t.participant.id !== threadId));
      if (selectedThread?.participant.id === threadId) {
        setSelectedThread(null);
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast.error("Failed to delete chat");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const filteredThreads = threads.filter((thread) =>
    thread.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Breadcrumb className="p-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Messages</BreadcrumbPage>
          </BreadcrumbItem>
          {selectedThread && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {selectedThread.participant.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="p-6 container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">MESSAGES</h1>
            <p className="text-gray-400">
              Manage your conversations and send messages
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-main hover:bg-second">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Chat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select
                  onValueChange={(value) => {
                    handleStartChat(value);
                    setDialogOpen(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || undefined} />
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
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-neutral-700 rounded-lg h-[calc(100vh-200px)]">
          <div className="grid grid-cols-3 gap-6 h-full">
            {/* Threads List */}
            <div className="col-span-1 border-r border-neutral-600 p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 overflow-y-auto h-[calc(100%-60px)]">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : filteredThreads.length > 0 ? (
                  filteredThreads.map((thread) => (
                    <div
                      key={thread.participant.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedThread?.participant.id === thread.participant.id
                          ? "bg-neutral-600"
                          : "hover:bg-neutral-600"
                      }`}
                      onClick={() => handleThreadSelection(thread)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage
                              src={thread.participant.avatar || undefined}
                            />
                            <AvatarFallback>
                              {thread.participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-700 ${
                              thread.participant.status === "online"
                                ? "bg-green-500"
                                : thread.participant.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-white truncate">
                              {thread.participant.name}
                              {thread.participant.unreadCount ? (
                                <span className="ml-2 bg-main text-white text-xs px-2 py-1 rounded-full">
                                  {thread.participant.unreadCount}
                                </span>
                              ) : null}
                            </p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteThread(thread.participant.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Chat
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {thread.lastMessage && (
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-400 truncate">
                                {thread.lastMessage.content}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(
                                  thread.lastMessage.createdAt.toString()
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 mt-4">
                    No messages found
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="col-span-2 p-6 flex flex-col h-full">
              {selectedThread ? (
                <>
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {selectedThread.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === selectedThread.participant.id
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === selectedThread.participant.id
                              ? "bg-neutral-600 text-white"
                              : "bg-main text-white"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatTimestamp(message.createdAt.toString())}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex gap-2">
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
                      disabled={sending}
                    />
                    <Button
                      className="bg-main hover:bg-second"
                      onClick={handleSendMessage}
                      disabled={sending}
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
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
