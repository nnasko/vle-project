"use client";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  CalendarDays,
  BookOpenCheck,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  PencilRuler,
} from "lucide-react";

// Define interfaces for better type safety
interface NavButtonProps {
  href: string;
  icon: React.ElementType;
  text: string;
  isCollapsed: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  href,
  icon: Icon,
  text,
  isCollapsed,
}) => (
  <Button
    asChild
    className={`w-full justify-start gap-3 text-white font-medium text-lg bg-neutral-800 hover:bg-neutral-700 transition-all ${
      isCollapsed ? "px-2" : "px-4"
    }`}
    variant="ghost"
  >
    <Link href={href} className="flex items-center">
      <Icon size={24} />
      {!isCollapsed && <span className="font-inter">{text}</span>}
    </Link>
  </Button>
);

const Navbar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notificationCount, setNotificationCount] = useState(3); // Using underscore prefix for unused setter

  return (
    <nav
      className={`relative bg-neutral-800 h-screen border-r-[#473BF0] border-r-2 transition-all duration-300 font-inter ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-8 bg-[#473BF0] text-white rounded-full hover:bg-[#372BDD]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeft
          className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
        />
      </Button>

      <div className="flex flex-col items-center p-4">
        <div className="flex flex-row gap-2 text-xl mb-6">
          <PencilRuler className="text-white" size={32} />
          {!isCollapsed && (
            <a
              href="/"
              className="font-medium text-center text-white mt-0.5 tracking-wide"
            >
              AAA<span className="font-light">+ College</span>
            </a>
          )}
        </div>

        <div className="relative mb-6">
          <Avatar className="rounded-md w-12 h-12">
            <AvatarImage
              src="https://i1.sndcdn.com/artworks-9Mq2VqsYI3nSr4sn-7Eh9cw-t500x500.jpg"
              alt="User avatar"
            />
          </Avatar>
          <div className="absolute -top-2 -right-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-[#473BF0] rounded-full w-6 h-6 p-1 hover:bg-[#372BDD]"
              asChild
            >
              <Link href="/notifications">
                <Bell className="text-white w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <p className="text-sm font-medium text-white mb-4">
            <span className="text-lg font-light tracking-wider">WELCOME</span>
            <br />
            John Doe
          </p>
        )}
      </div>

      <Separator
        orientation="horizontal"
        className="w-full h-0.5 bg-[#473BF0] mb-6"
      />

      <div className="flex flex-col items-center px-4 gap-4">
        <NavButton
          href="/staff"
          icon={Users}
          text="STAFF"
          isCollapsed={isCollapsed}
        />
        <NavButton
          href="/students"
          icon={GraduationCap}
          text="STUDENTS"
          isCollapsed={isCollapsed}
        />
        <NavButton
          href="/timetable"
          icon={CalendarDays}
          text="TIMETABLE"
          isCollapsed={isCollapsed}
        />
        <NavButton
          href="/messages"
          icon={MessageSquare}
          text="MESSAGES"
          isCollapsed={isCollapsed}
        />
        <NavButton
          href="/lessons"
          icon={BookOpenCheck}
          text="LESSONS"
          isCollapsed={isCollapsed}
        />
        <NavButton
          href="/assignments"
          icon={FileText}
          text="ASSIGNMENTS"
          isCollapsed={isCollapsed}
        />

        <Separator
          orientation="horizontal"
          className="w-full h-0.5 bg-[#6665DD] my-4"
        />

        <NavButton
          href="/settings"
          icon={Settings}
          text="SETTINGS"
          isCollapsed={isCollapsed}
        />
        <NavButton
          href="/logout"
          icon={LogOut}
          text="LOGOUT"
          isCollapsed={isCollapsed}
        />
      </div>
    </nav>
  );
};

export default Navbar;
