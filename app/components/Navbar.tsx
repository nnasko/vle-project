"use client";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  GraduationCap,
  CalendarDays,
  BookOpen,
  MessageSquare,
  FileText,
  LogOut,
  ChevronLeft,
  Bell,
  PencilRuler,
  School2,
  BarChart3,
  CircleUserRound,
  HomeIcon,
  UserSquare2,
} from "lucide-react";

type UserRole = "admin" | "teacher" | "student";

interface NavButtonProps {
  href: string;
  icon: React.ElementType;
  text: string;
  isCollapsed: boolean;
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  text: string;
  roles: UserRole[];
}

const NavButton: React.FC<NavButtonProps> = ({
  href,
  icon: Icon,
  text,
  isCollapsed,
}) => (
  <Button
    asChild
    className={`w-full justify-start gap-3  text-white font-medium text-lg bg-neutral-800 hover:bg-neutral-700 transition-all ${
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

const navigationItems: NavItem[] = [
  {
    href: "/",
    icon: HomeIcon,
    text: "HOME",
    roles: ["student", "teacher", "admin"],
  },
  // Admin navigation
  {
    href: "/departments",
    icon: School2,
    text: "DEPARTMENTS",
    roles: ["admin"],
  },
  {
    href: "/students",
    icon: GraduationCap,
    text: "STUDENTS",
    roles: ["admin"],
  },
  {
    href: "/analytics",
    icon: BarChart3,
    text: "ANALYTICS",
    roles: ["admin"],
  },
  {
    href: "/timetables",
    icon: CalendarDays,
    text: "TIMETABLES",
    roles: ["admin"],
  },

  // Teacher navigation
  {
    href: "/cohorts",
    icon: UserSquare2,
    text: "COHORTS",
    roles: ["teacher"],
  },
  {
    href: "/assignments",
    icon: FileText,
    text: "ASSIGNMENTS",
    roles: ["teacher"],
  },
  {
    href: "/timetable",
    icon: CalendarDays,
    text: "TIMETABLE",
    roles: ["teacher"],
  },
  // Student navigation
  {
    href: "/course",
    icon: BookOpen,
    text: "MY COURSE",
    roles: ["student"],
  },
  {
    href: "/assignments",
    icon: FileText,
    text: "ASSIGNMENTS",
    roles: ["student"],
  },
  {
    href: "/timetable",
    icon: CalendarDays,
    text: "TIMETABLE",
    roles: ["student"],
  },

  // Shared items
  {
    href: "/messages",
    icon: MessageSquare,
    text: "MESSAGES",
    roles: ["admin", "teacher", "student"],
  },
];

const bottomNavItems: NavItem[] = [
  {
    href: "/profile",
    icon: CircleUserRound,
    text: "PROFILE",
    roles: ["admin", "teacher", "student"],
  },
  {
    href: "/logout",
    icon: LogOut,
    text: "LOGOUT",
    roles: ["admin", "teacher", "student"],
  },
];

interface NavbarProps {
  userRole: UserRole;
  userName: string;
  userAvatar?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  userRole,
  userName,
  userAvatar = "https://media.tenor.com/Tw8FiJa_KWsAAAAe/alpha-wolf.png",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const filteredNavItems = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <nav
      className={`relative top-0 left-0 bg-neutral-800 min-h-screen border-r-[#473BF0] border-r-2 transition-all duration-300 font-inter ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="sticky top-0 bg-neutral-800 z-10 pb-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-8 bg-[#473BF0] text-white rounded-full hover:bg-[#372BDD]"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={`transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
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
              <AvatarImage src={userAvatar} alt="User avatar" />
            </Avatar>
            <div className="absolute -top-2 -left-2">
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
            <div className="text-sm font-medium text-white mb-4 text-center">
              <span className="text-lg font-light tracking-wider block">
                WELCOME
              </span>
              <span className="block">{userName}</span>
              <span className="text-xs text-gray-400 capitalize">
                ({userRole})
              </span>
            </div>
          )}
        </div>

        <Separator
          orientation="horizontal"
          className="w-full h-0.5 bg-[#473BF0]"
        />
      </div>

      <div className="flex flex-col items-center px-4 gap-4 pb-4">
        {filteredNavItems.map((item) => (
          <NavButton
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            isCollapsed={isCollapsed}
          />
        ))}

        <Separator
          orientation="horizontal"
          className="w-full h-0.5 bg-[#6665DD] my-4"
        />

        {bottomNavItems.map((item) => (
          <NavButton
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
