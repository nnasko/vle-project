"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  HomeIcon,
  Clock,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Module {
  id: string;
  code: string;
  name: string;
  passingRate: number;
  averageScore: number;
}

interface DepartmentData {
  id: number;
  name: string;
  head: string;
  status: "active" | "inactive";
  description: string;
  staffCount: number;
  studentCount: number;
  modules: Module[];
  enrollmentTrend: { month: string; students: number }[];
  attendanceRate: { week: string; rate: number }[];
}

// Mock API function - replace with actual API call
const fetchDepartmentData = async (id: string): Promise<DepartmentData> => {
  // This is mock data - replace with actual API call
  const mockDepartments: Record<string, DepartmentData> = {
    "1": {
      id: 1,
      name: "Software Development",
      head: "Dr. Sarah Johnson",
      status: "active",
      description:
        "Leading department for software engineering and development practices.",
      staffCount: 12,
      studentCount: 175,
      modules: [
        {
          id: "1",
          code: "SD101",
          name: "Introduction to Programming",
          passingRate: 85,
          averageScore: 76,
        },
        {
          id: "2",
          code: "SD201",
          name: "Web Development",
          passingRate: 78,
          averageScore: 72,
        },
        {
          id: "3",
          code: "SD301",
          name: "Mobile App Development",
          passingRate: 82,
          averageScore: 74,
        },
      ],
      enrollmentTrend: [
        { month: "Jan", students: 145 },
        { month: "Feb", students: 156 },
        { month: "Mar", students: 162 },
        { month: "Apr", students: 168 },
        { month: "May", students: 172 },
        { month: "Jun", students: 175 },
      ],
      attendanceRate: [
        { week: "Week 1", rate: 94 },
        { week: "Week 2", rate: 92 },
        { week: "Week 3", rate: 95 },
        { week: "Week 4", rate: 91 },
        { week: "Week 5", rate: 93 },
        { week: "Week 6", rate: 94 },
      ],
    },
    "2": {
      id: 2,
      name: "Data Science",
      head: "Prof. Michael Chen",
      status: "active",
      description:
        "Focused on data analysis, machine learning, and statistical modeling.",
      staffCount: 8,
      studentCount: 98,
      modules: [
        {
          id: "4",
          code: "DS101",
          name: "Data Analysis Fundamentals",
          passingRate: 88,
          averageScore: 79,
        },
        {
          id: "5",
          code: "DS201",
          name: "Machine Learning",
          passingRate: 75,
          averageScore: 70,
        },
        {
          id: "6",
          code: "DS301",
          name: "Big Data Analytics",
          passingRate: 80,
          averageScore: 73,
        },
      ],
      enrollmentTrend: [
        { month: "Jan", students: 85 },
        { month: "Feb", students: 90 },
        { month: "Mar", students: 92 },
        { month: "Apr", students: 95 },
        { month: "May", students: 97 },
        { month: "Jun", students: 98 },
      ],
      attendanceRate: [
        { week: "Week 1", rate: 92 },
        { week: "Week 2", rate: 93 },
        { week: "Week 3", rate: 91 },
        { week: "Week 4", rate: 94 },
        { week: "Week 5", rate: 92 },
        { week: "Week 6", rate: 93 },
      ],
    },
  };

  return mockDepartments[id] || null;
};

interface DepartmentDetailProps {
  params: {
    id: string;
  };
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ params }) => {
  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        const data = await fetchDepartmentData(params.id);
        if (data) {
          setDepartment(data);
        } else {
          // Redirect to departments list if department not found
          router.push("/departments");
        }
      } catch (error) {
        console.error("Error loading department:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading department data...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return null; // Router will handle redirect
  }

  const StaffTab = ({ departmentId }) => {
    const staffMembers = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        role: "Department Head",
        email: "sarah.j@example.com",
        phone: "+1234567890",
        avatar: "/api/placeholder/32/32",
        modules: ["SD101", "SD301"],
        status: "active",
      },
      {
        id: 2,
        name: "Prof. David Wilson",
        role: "Senior Lecturer",
        email: "david.w@example.com",
        phone: "+1234567891",
        avatar: "/api/placeholder/32/32",
        modules: ["SD201", "SD401"],
        status: "active",
      },
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Input placeholder="Search staff..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="head">Department Head</SelectItem>
                <SelectItem value="senior">Senior Lecturer</SelectItem>
                <SelectItem value="lecturer">Lecturer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-main hover:bg-second">Add Staff Member</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={staff.avatar} />
                      <AvatarFallback>{staff.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{staff.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-4 w-4" /> {staff.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-4 w-4" /> {staff.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {staff.modules.map((module) => (
                      <Badge key={module} variant="secondary">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className="bg-main text-white"
                    variant={
                      staff.status === "active" ? "default" : "secondary"
                    }
                  >
                    {staff.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Students Tab Content
  const StudentsTab = ({ departmentId }) => {
    const students = [
      {
        id: 1,
        name: "John Smith",
        studentId: "SD2024001",
        year: 2,
        email: "john.s@example.com",
        avatar: "/api/placeholder/32/32",
        attendance: "95%",
        performance: "A",
        status: "active",
      },
      {
        id: 2,
        name: "Emma Davis",
        studentId: "SD2024002",
        year: 2,
        email: "emma.d@example.com",
        avatar: "/api/placeholder/32/32",
        attendance: "92%",
        performance: "B+",
        status: "active",
      },
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Input placeholder="Search students..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">Year 1</SelectItem>
                <SelectItem value="2">Year 2</SelectItem>
                <SelectItem value="3">Year 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.studentId}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>Year {student.year}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {student.attendance}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{student.performance}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className="bg-main text-white"
                    variant={
                      student.status === "active" ? "default" : "secondary"
                    }
                  >
                    {student.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Modules Tab Content
  const ModulesTab = ({ departmentId }) => {
    const modules = [
      {
        id: 1,
        code: "SD101",
        name: "Introduction to Programming",
        lecturer: "Dr. Sarah Johnson",
        students: 45,
        schedule: "Mon, Wed 10:00-12:00",
        status: "active",
        passingRate: "85%",
      },
      {
        id: 2,
        code: "SD201",
        name: "Web Development",
        lecturer: "Prof. David Wilson",
        students: 38,
        schedule: "Tue, Thu 14:00-16:00",
        status: "active",
        passingRate: "78%",
      },
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Input placeholder="Search modules..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-main hover:bg-second">Add Module</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Lecturer</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{module.name}</div>
                    <div className="text-sm text-gray-500">{module.code}</div>
                  </div>
                </TableCell>
                <TableCell>{module.lecturer}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {module.students}
                  </div>
                </TableCell>
                <TableCell>{module.schedule}</TableCell>
                <TableCell>
                  <Badge variant="outline">{module.passingRate}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className="bg-main text-white"
                    variant={
                      module.status === "active" ? "default" : "secondary"
                    }
                  >
                    {module.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const calculateAverageAttendance = () => {
    return Math.round(
      department.attendanceRate.reduce((acc, curr) => acc + curr.rate, 0) /
        department.attendanceRate.length
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/departments">Departments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{department.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="max-w-6xl mx-auto bg-neutral-700 p-6 rounded-md">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{department.name}</h1>
            <Badge
              className="bg-main text-white"
              variant={department.status === "active" ? "default" : "secondary"}
            >
              {department.status}
            </Badge>
          </div>
          <p className="text-gray-400">{department.description}</p>
        </div>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-main" />
              <span className="text-sm text-gray-500">Total Staff</span>
            </div>
            <div className="text-2xl font-bold">{department.staffCount}</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-main" />
              <span className="text-sm text-gray-500">Total Students</span>
            </div>
            <div className="text-2xl font-bold">{department.studentCount}</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-main" />
              <span className="text-sm text-gray-500">Active Modules</span>
            </div>
            <div className="text-2xl font-bold">
              {department.modules.length}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-main" />
              <span className="text-sm text-gray-500">Average Attendance</span>
            </div>
            <div className="text-2xl font-bold">
              {calculateAverageAttendance()}%
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          <TabsContent value="staff">
            <Card className="p-4">
              <StaffTab departmentId={department.id} />
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="p-4">
              <StudentsTab departmentId={department.id} />
            </Card>
          </TabsContent>

          <TabsContent value="modules">
            <Card className="p-4">
              <ModulesTab departmentId={department.id} />
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            {/* Enrollment Trend */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Student Enrollment Trend
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={department.enrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#473BF0"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Module Performance */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Module Performance</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={department.modules}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="code" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="passingRate"
                      name="Passing Rate %"
                      fill="#473BF0"
                    />
                    <Bar
                      dataKey="averageScore"
                      name="Average Score"
                      fill="#6665DD"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Attendance Trend */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Attendance Rate</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={department.attendanceRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#473BF0"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentDetail;
