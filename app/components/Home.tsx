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
} from "lucide-react";
import { Overview } from "./charts/Overview";
import { RecentSales } from "./charts/RecentSales";

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
    className="h-24 flex-1 flex flex-col items-center justify-center gap-2 min-w-[150px] bg-neutral-100 hover:bg-neutral-200 text-black"
    onClick={onClick}
  >
    <Icon className="h-6 w-6" />
    <span className="text-sm font-medium">{label}</span>
  </Button>
);

// Sample data for the Overview chart
const overviewData = [
  {
    name: "Jan",
    attendance: 234,
    grades: 164,
  },
  {
    name: "Feb",
    attendance: 278,
    grades: 196,
  },
  {
    name: "Mar",
    attendance: 264,
    grades: 162,
  },
  {
    name: "Apr",
    attendance: 308,
    grades: 191,
  },
  {
    name: "May",
    attendance: 289,
    grades: 182,
  },
];

const StaffDashboard = () => (
  <div className="space-y-6 bg-neutral-700 p-4 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-neutral-100 text-black">
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
          <CardDescription className="text-neutral-400">
            Active enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">280</div>
          <p className="text-sm text-green-500">↑ 12.5% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 text-black">
        <CardHeader>
          <CardTitle>Average Attendance</CardTitle>
          <CardDescription className="text-neutral-400">
            This semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">95%</div>
          <p className="text-sm text-green-500">↑ 2.3% from last semester</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 text-black">
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
      <Card className="col-span-4 bg-neutral-100 text-black">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Overview data={overviewData} />
        </CardContent>
      </Card>
      <Card className="col-span-3 bg-neutral-100 text-black">
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
      <Card className="bg-neutral-100 text-black">
        <CardHeader>
          <CardTitle>Attendance Rate</CardTitle>
          <CardDescription className="text-neutral-400">
            This semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">96%</div>
          <p className="text-sm text-green-500">Above class average</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 text-black">
        <CardHeader>
          <CardTitle>Current Grades</CardTitle>
          <CardDescription className="text-neutral-400">
            Cumulative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">A</div>
          <p className="text-sm text-green-500">Top 5% of class</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 text-black">
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
      <QuickActionButton icon={BookOpen} label="View Courses" />
      <QuickActionButton icon={Calendar} label="Class Schedule" />
      <QuickActionButton icon={FileText} label="Assignments" />
      <QuickActionButton icon={MessageSquare} label="Messages" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 ">
      <Card className="col-span-4 bg-neutral-100 text-black">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Overview data={overviewData} />
        </CardContent>
      </Card>
      <Card className="col-span-3 bg-neutral-100 text-black">
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
  const userRole = "staff"; // or "student"

  return (
    <div className="mt-2 bg-white max-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Welcome back, {userRole === "staff" ? "Dr. Smith" : "John"}
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

        {userRole === "staff" ? <StaffDashboard /> : <StudentDashboard />}
      </div>
    </div>
  );
};

export default Home;
