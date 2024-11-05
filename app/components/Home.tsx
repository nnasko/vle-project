"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  BellRing,
  MessageSquare,
  Building2,
  UserCog,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react";
import { Overview } from "./charts/Overview";
import { RecentSales } from "./charts/RecentSales";
import {
  SelectContent,
  SelectTrigger,
  Select,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import DepartmentPerformanceChart from "./charts/DepartmentPerformanceChart";

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <Button
    variant="outline"
    className="h-24 flex-1 flex flex-col items-center justify-center gap-2 min-w-[150px] bg-white hover:bg-neutral-200 text-black"
    onClick={onClick}
  >
    <Icon className="h-6 w-6" />
    <span className="text-sm font-medium">{label}</span>
  </Button>
);

// Sample data for the Overview chart
const overviewData = [
  { name: "Jan", attendance: 95, grades: 8.5 },
  { name: "Feb", attendance: 92, grades: 7.8 },
  { name: "Mar", attendance: 88, grades: 8.2 },
  { name: "Apr", attendance: 90, grades: 8.7 },
  { name: "May", attendance: 85, grades: 7.9 },
];

const AdminDashboard = () => (
  <div className="space-y-6 bg-neutral-700 p-4 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
          <CardDescription className="text-neutral-400">
            Across all departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">1,245</div>
          <p className="text-sm text-emerald-600">↑ 8.2% from last year</p>
        </CardContent>
      </Card>
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Total Staff</CardTitle>
          <CardDescription className="text-neutral-400">
            Academic & Support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">142</div>
          <p className="text-sm text-emerald-600">↑ 3 new this month</p>
        </CardContent>
      </Card>
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription className="text-neutral-400">
            Active departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">8</div>
          <p className="text-sm text-emerald-600">All performing well</p>
        </CardContent>
      </Card>
    </div>

    <div className="flex flex-wrap gap-4">
      <QuickActionButton icon={Building2} label="Departments" />
      <QuickActionButton icon={UserCog} label="Manage Staff" />
      <QuickActionButton icon={GraduationCap} label="Students" />
      <QuickActionButton icon={BarChart3} label="Analytics" />
      <QuickActionButton icon={Settings} label="Settings" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      <Card className="col-span-4 bg-white text-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Institutional Overview</CardTitle>
          <Select defaultValue="year">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DepartmentPerformanceChart />
        </CardContent>
      </Card>
      <div className="col-span-3 space-y-4">
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription className="text-neutral-400">
              Latest administrative changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New department head appointed",
                  department: "Computer Science",
                  date: "2 hours ago",
                },
                {
                  action: "Course curriculum updated",
                  department: "Data Science",
                  date: "5 hours ago",
                },
                {
                  action: "Staff training completed",
                  department: "All Departments",
                  date: "1 day ago",
                },
                {
                  action: "New equipment approved",
                  department: "Engineering",
                  date: "2 days ago",
                },
              ].map((update, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{update.action}</p>
                    <p className="text-xs text-gray-500">{update.department}</p>
                  </div>
                  <span className="text-xs text-gray-500">{update.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const TeacherDashboard = () => (
  <div className="space-y-6 bg-neutral-700 p-4 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
          <CardDescription className="text-neutral-400">
            Active enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">280</div>
          <p className="text-sm text-emerald-600">↑ 12.5% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Average Attendance</CardTitle>
          <CardDescription className="text-neutral-400">
            This semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">95%</div>
          <p className="text-sm text-emerald-600">↑ 2.3% from last semester</p>
        </CardContent>
      </Card>
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
          <CardDescription className="text-neutral-400">
            Requires attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">8</div>
          <p className="text-sm text-red-500">3 urgent tasks</p>
        </CardContent>
      </Card>
    </div>

    <div className="flex flex-wrap gap-4">
      <QuickActionButton icon={Users} label="Manage Students" />
      <QuickActionButton icon={Calendar} label="Schedule Classes" />
      <QuickActionButton icon={FileText} label="View Reports" />
      <QuickActionButton icon={MessageSquare} label="Messages" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      <Card className="col-span-4 bg-white text-black">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Overview data={overviewData} />
        </CardContent>
      </Card>
      <Card className="col-span-3 bg-white text-black">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription className="text-neutral-400">
            Latest student updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSales />
        </CardContent>
      </Card>
    </div>
  </div>
);

const StudentDashboard = () => (
  <div className="space-y-6 bg-neutral-700 p-4 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Attendance Rate</CardTitle>
          <CardDescription className="text-neutral-400">
            This semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">96%</div>
          <p className="text-sm text-emerald-600">Above class average</p>
        </CardContent>
      </Card>
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Current Grades</CardTitle>
          <CardDescription className="text-neutral-400">
            Cumulative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">A</div>
          <p className="text-sm text-emerald-600">Top 5% of class</p>
        </CardContent>
      </Card>
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription className="text-neutral-400">
            Due this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">5</div>
          <p className="text-sm text-amber-500">2 assignments due soon</p>
        </CardContent>
      </Card>
    </div>

    <div className="flex flex-wrap gap-4">
      <QuickActionButton icon={BookOpen} label="Modules" />
      <QuickActionButton icon={Calendar} label="Timetable" />
      <QuickActionButton icon={FileText} label="Assignments" />
      <QuickActionButton icon={MessageSquare} label="Messages" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 ">
      <Card className="col-span-4 bg-white text-black">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Overview data={overviewData} />
        </CardContent>
      </Card>
      <Card className="col-span-3 bg-white text-black">
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription className="text-neutral-400">
            Your latest activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSales />
        </CardContent>
      </Card>
    </div>
  </div>
);
const Home = () => {
  const userRole = "student"; // "teacher" or "student" or "admin"

  const getName = () => {
    switch (userRole) {
      case "admin":
        return "Administrator";
      case "teacher":
        return "Dr. Smith";
      case "student":
        return "John";
      default:
        return "User";
    }
  };

  return (
    <div className="mt-2 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Welcome back, {getName()}
            </h1>
            <p className="text-neutral-400">
              Here&apos;s what&apos;s happening today
            </p>
          </div>
          <Button className="bg-[#473BF0] hover:bg-[#6665DD] text-white">
            <BellRing className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>

        {userRole === "admin" ? (
          <AdminDashboard />
        ) : userRole === "teacher" ? (
          <TeacherDashboard />
        ) : (
          <StudentDashboard />
        )}
      </div>
    </div>
  );
};

export default Home;
