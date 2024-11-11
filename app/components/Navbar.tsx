// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CircleUserRound,
  HomeIcon,
  UserSquare2,
} from "lucide-react";

type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentProfile?: { studentId: string };
  teacherProfile?: { employeeId: string };
  adminProfile?: { employeeId: string };
}

interface NavButtonProps {
  href: string;
  icon: React.ElementType;
  text: string;
  isCollapsed: boolean;
  onClick?: () => void;
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
  onClick,
}) => {
  const Component = onClick ? Button : Link;

  return (
    <Button
      asChild
      className={`w-full justify-start gap-3 text-white font-medium text-lg bg-neutral-800 hover:bg-neutral-700 transition-all ${
        isCollapsed ? "px-2" : "px-4"
      }`}
      variant="ghost"
      onClick={onClick}
    >
      <Component href={href} className="flex items-center">
        <Icon size={24} />
        {!isCollapsed && <span className="font-inter">{text}</span>}
      </Component>
    </Button>
  );
};

const navigationItems: NavItem[] = [
  {
    href: "/",
    icon: HomeIcon,
    text: "HOME",
    roles: ["STUDENT", "TEACHER", "ADMIN"],
  },
  // Admin navigation
  {
    href: "/departments",
    icon: School2,
    text: "DEPARTMENTS",
    roles: ["ADMIN"],
  },
  {
    href: "/students",
    icon: GraduationCap,
    text: "STUDENTS",
    roles: ["ADMIN"],
  },
  {
    href: "/timetables",
    icon: CalendarDays,
    text: "TIMETABLES",
    roles: ["ADMIN"],
  },
  // Teacher navigation
  {
    href: "/cohorts",
    icon: UserSquare2,
    text: "COHORTS",
    roles: ["TEACHER"],
  },
  {
    href: "/assignments",
    icon: FileText,
    text: "ASSIGNMENTS",
    roles: ["TEACHER"],
  },
  {
    href: "/timetable",
    icon: CalendarDays,
    text: "TIMETABLE",
    roles: ["TEACHER"],
  },
  // Student navigation
  {
    href: "/course",
    icon: BookOpen,
    text: "MY COURSE",
    roles: ["STUDENT"],
  },
  {
    href: "/assignments",
    icon: FileText,
    text: "ASSIGNMENTS",
    roles: ["STUDENT"],
  },
  {
    href: "/timetable",
    icon: CalendarDays,
    text: "TIMETABLE",
    roles: ["STUDENT"],
  },
  // Shared items
  {
    href: "/messages",
    icon: MessageSquare,
    text: "MESSAGES",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
];

const Navbar = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data and notifications on component mount
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications/unread-count");
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const { count } = await response.json();
        setNotificationCount(count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUserData();
    fetchNotifications();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  const filteredNavItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const bottomNavItems: NavItem[] = [
    {
      href: "/profile",
      icon: CircleUserRound,
      text: "PROFILE",
      roles: ["ADMIN", "TEACHER", "STUDENT"],
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 bg-neutral-800 min-h-screen border-r-[#473BF0] border-r-2 transition-all duration-300 font-inter ${
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
              <Link
                href="/"
                className="font-medium text-center text-white mt-0.5 tracking-wide"
              >
                AAA<span className="font-light">+ College</span>
              </Link>
            )}
          </div>

          <div className="relative mb-6">
            <Avatar className="rounded-md w-12 h-12">
              <AvatarImage
                src={user.avatar || "/default-avatar.png"}
                alt="User avatar"
              />
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
              <span className="block">{user.name}</span>
              <span className="text-xs text-gray-400 capitalize">
                ({user.role.toLowerCase()})
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

        <NavButton
          href=""
          icon={LogOut}
          text="LOGOUT"
          isCollapsed={isCollapsed}
          onClick={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Navbar;
