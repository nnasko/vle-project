"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  FileText,
  GraduationCap,
  AlertCircle,
  InboxIcon,
} from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NotificationType {
  id: number;
  type: "academic" | "message" | "assignment" | "grade" | "alert";
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: LucideIcon;
  link: string;
}

const initialNotifications: NotificationType[] = [
  {
    id: 1,
    type: "academic",
    title: "New Course Material Available",
    message: "New materials have been uploaded for Software Development course",
    date: "2024-03-20",
    read: false,
    icon: BookOpen,
    link: "/courses",
  },
  {
    id: 2,
    type: "message",
    title: "New Message from Dr. Smith",
    message: "Regarding your recent project submission",
    date: "2024-03-19",
    read: false,
    icon: MessageSquare,
    link: "/messages",
  },
  {
    id: 3,
    type: "assignment",
    title: "Assignment Due Reminder",
    message: "Web Development assignment due in 2 days",
    date: "2024-03-18",
    read: true,
    icon: FileText,
    link: "/assignments",
  },
  {
    id: 4,
    type: "grade",
    title: "New Grade Posted",
    message: "Your grade for Database Systems has been posted",
    date: "2024-03-17",
    read: false,
    icon: GraduationCap,
    link: "/grades",
  },
  {
    id: 5,
    type: "alert",
    title: "System Maintenance",
    message: "System will be down for maintenance on Sunday",
    date: "2024-03-16",
    read: true,
    icon: AlertCircle,
    link: "#",
  },
];

interface NotificationIconProps {
  type: NotificationType["type"];
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
  const icons: Record<NotificationType["type"], LucideIcon> = {
    academic: BookOpen,
    message: MessageSquare,
    assignment: FileText,
    grade: GraduationCap,
    alert: AlertCircle,
  };

  const Icon = icons[type] || Bell;
  return <Icon className="w-5 h-5" />;
};

export default function Notifications() {
  const [filter, setFilter] = useState<NotificationType["type"] | "all">("all");
  const [notifications, setNotifications] =
    useState<NotificationType[]>(initialNotifications);

  const filteredNotifications = notifications.filter(
    (notification) => filter === "all" || notification.type === filter
  );

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="p-6 min-h-screen ">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold">NOTIFICATIONS</h1>
          <Button onClick={markAllAsRead} className="bg-main hover:bg-second">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-4 bg-neutral-700 p-6 rounded-lg">
          <div className="flex gap-4 mb-6">
            <Select
              value={filter}
              onValueChange={(value: NotificationType["type"] | "all") =>
                setFilter(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="grade">Grades</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    notification.read
                      ? "bg-gray-50"
                      : "bg-white border-l-4 border-l-main"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-gray-100">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Link href={notification.link} className="flex-1">
                          <div>
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </Link>
                        <span className="text-sm text-gray-500">
                          {notification.date}
                        </span>
                      </div>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <InboxIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    No notifications to display
                  </h3>
                  <p className="text-gray-500">
                    {filter === "all"
                      ? "You're all caught up! Check back later for new notifications."
                      : `No ${filter} notifications found. Try selecting a different filter.`}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
