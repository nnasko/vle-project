"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Search,
  Plus,
  BookText,
  ListChecks,
  ClipboardCheck,
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

interface LearningOutcome {
  id: string;
  description: string;
}

interface Assessment {
  id: string;
  type: string;
  weight: number;
  description: string;
}

interface Module {
  id: string;
  code: string;
  name: string;
  year: number;
  credits: number;
  description: string;
  prerequisites: string[];
  learningOutcomes: LearningOutcome[];
  assessments: Assessment[];
  topics: string[];
  status: "active" | "review" | "archived";
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
  enrollmentTrend: { month: string; students: number }[];
  attendanceRate: { week: string; rate: number }[];
}

const departmentModules = {
  softwareDevelopment: [
    {
      id: "1",
      code: "SD101",
      name: "Programming Fundamentals",
      year: 1,
      credits: 20,
      description:
        "Introduction to programming concepts and problem-solving using Python",
      prerequisites: [],
      learningOutcomes: [
        {
          id: "lo1",
          description: "Understand and apply fundamental programming concepts",
        },
        {
          id: "lo2",
          description:
            "Develop simple algorithms to solve computational problems",
        },
        {
          id: "lo3",
          description: "Write and debug basic Python programs",
        },
      ],
      assessments: [
        {
          id: "a1",
          type: "Programming Assignment",
          weight: 40,
          description: "Series of programming exercises",
        },
        {
          id: "a2",
          type: "Final Project",
          weight: 60,
          description: "Development of a complete application",
        },
      ],
      topics: [
        "Variables and Data Types",
        "Control Structures",
        "Functions and Methods",
        "Basic Data Structures",
        "Object-Oriented Programming Basics",
        "File Handling",
        "Basic Error Handling",
      ],
      status: "active",
      passingRate: 85,
      averageScore: 76,
    },
    {
      id: "2",
      code: "SD102",
      name: "Web Development Foundations",
      year: 1,
      credits: 20,
      description:
        "Introduction to web development technologies and principles",
      prerequisites: ["SD101"],
      learningOutcomes: [
        {
          id: "lo1",
          description: "Create responsive websites using HTML5 and CSS3",
        },
        {
          id: "lo2",
          description: "Implement client-side functionality using JavaScript",
        },
        {
          id: "lo3",
          description: "Understand web accessibility and usability principles",
        },
      ],
      assessments: [
        {
          id: "a1",
          type: "Portfolio",
          weight: 50,
          description: "Collection of web development projects",
        },
        {
          id: "a2",
          type: "Technical Test",
          weight: 50,
          description: "Practical web development assessment",
        },
      ],
      topics: [
        "HTML5 Semantics",
        "CSS3 Layouts and Responsive Design",
        "JavaScript Fundamentals",
        "DOM Manipulation",
        "Web APIs",
        "Version Control with Git",
        "Web Performance Optimization",
      ],
      status: "active",
      passingRate: 82,
      averageScore: 74,
    },
  ],
  dataScience: [
    {
      id: "ds101",
      code: "DS101",
      name: "Data Analysis Fundamentals",
      year: 1,
      credits: 20,
      description:
        "Introduction to data analysis concepts, statistical methods, and basic Python programming for data science",
      prerequisites: [],
      learningOutcomes: [
        {
          id: "lo1",
          description:
            "Apply fundamental statistical concepts to analyze datasets",
        },
        {
          id: "lo2",
          description: "Implement data cleaning and preprocessing techniques",
        },
        {
          id: "lo3",
          description:
            "Use Python libraries (NumPy, Pandas) for data manipulation",
        },
        {
          id: "lo4",
          description:
            "Create basic data visualizations using matplotlib and seaborn",
        },
      ],
      assessments: [
        {
          id: "a1",
          type: "Data Analysis Project",
          weight: 40,
          description: "Individual project analyzing a real-world dataset",
        },
        {
          id: "a2",
          type: "Technical Assessment",
          weight: 30,
          description: "Practical examination of data analysis skills",
        },
        {
          id: "a3",
          type: "Written Assignment",
          weight: 30,
          description: "Statistical concepts and methodology report",
        },
      ],
      topics: [
        "Introduction to Statistics",
        "Python for Data Analysis",
        "Data Cleaning and Preprocessing",
        "Exploratory Data Analysis",
        "Descriptive Statistics",
        "Probability Distributions",
        "Data Visualization Basics",
        "Hypothesis Testing",
      ],
      status: "active",
      passingRate: 88,
      averageScore: 79,
    },
    {
      id: "ds102",
      code: "DS102",
      name: "Statistical Learning",
      year: 1,
      credits: 20,
      description:
        "Fundamentals of statistical learning, regression analysis, and predictive modeling",
      prerequisites: ["DS101"],
      learningOutcomes: [
        {
          id: "lo1",
          description: "Apply regression techniques for predictive modeling",
        },
        {
          id: "lo2",
          description: "Evaluate model performance using statistical metrics",
        },
        {
          id: "lo3",
          description: "Implement feature selection and engineering methods",
        },
        {
          id: "lo4",
          description: "Understand bias-variance tradeoff and model validation",
        },
      ],
      assessments: [
        {
          id: "a1",
          type: "Modeling Project",
          weight: 50,
          description: "Predictive modeling project with real data",
        },
        {
          id: "a2",
          type: "Written Exam",
          weight: 30,
          description: "Statistical learning theory and concepts",
        },
        {
          id: "a3",
          type: "Assignments",
          weight: 20,
          description: "Regular programming assignments",
        },
      ],
      topics: [
        "Linear Regression",
        "Logistic Regression",
        "Model Selection",
        "Cross-Validation",
        "Feature Engineering",
        "Regularization Methods",
        "Model Evaluation Metrics",
        "Statistical Inference",
      ],
      status: "active",
      passingRate: 85,
      averageScore: 76,
    },
    {
      id: "ds201",
      code: "DS201",
      name: "Machine Learning",
      year: 2,
      credits: 20,
      description:
        "Comprehensive study of machine learning algorithms, techniques, and applications",
      prerequisites: ["DS101", "DS102"],
      learningOutcomes: [
        {
          id: "lo1",
          description: "Implement and evaluate supervised learning algorithms",
        },
        {
          id: "lo2",
          description:
            "Apply unsupervised learning techniques for pattern discovery",
        },
        {
          id: "lo3",
          description: "Develop deep learning models using modern frameworks",
        },
        {
          id: "lo4",
          description:
            "Deploy machine learning models in practical applications",
        },
      ],
      assessments: [
        {
          id: "a1",
          type: "ML Project",
          weight: 40,
          description: "End-to-end machine learning project",
        },
        {
          id: "a2",
          type: "Research Paper",
          weight: 30,
          description: "Analysis of advanced ML techniques",
        },
        {
          id: "a3",
          type: "Practical Exam",
          weight: 30,
          description: "Implementation of ML algorithms",
        },
      ],
      topics: [
        "Supervised Learning",
        "Unsupervised Learning",
        "Neural Networks",
        "Support Vector Machines",
        "Decision Trees",
        "Ensemble Methods",
        "Deep Learning Introduction",
        "Model Deployment",
      ],
      status: "active",
      passingRate: 75,
      averageScore: 70,
    },
    {
      id: "ds301",
      code: "DS301",
      name: "Big Data Analytics",
      year: 3,
      credits: 20,
      description:
        "Advanced techniques for processing and analyzing large-scale datasets using distributed computing",
      prerequisites: ["DS201"],
      learningOutcomes: [
        {
          id: "lo1",
          description: "Design and implement big data processing pipelines",
        },
        {
          id: "lo2",
          description:
            "Apply distributed computing frameworks for data analysis",
        },
        {
          id: "lo3",
          description: "Develop scalable machine learning solutions",
        },
        {
          id: "lo4",
          description: "Implement real-time data processing systems",
        },
      ],
      assessments: [
        {
          id: "a1",
          type: "Group Project",
          weight: 50,
          description: "Large-scale data processing project",
        },
        {
          id: "a2",
          type: "Individual Assignment",
          weight: 30,
          description: "Distributed computing implementation",
        },
        {
          id: "a3",
          type: "Presentation",
          weight: 20,
          description: "Project presentation and documentation",
        },
      ],
      topics: [
        "Hadoop Ecosystem",
        "Apache Spark",
        "Distributed Computing",
        "Stream Processing",
        "NoSQL Databases",
        "Data Lakes",
        "Scalable ML Pipelines",
        "Cloud Computing Platforms",
      ],
      status: "active",
      passingRate: 80,
      averageScore: 73,
    },
    {
      id: "ds302",
      code: "DS302",
      name: "Data Visualization and Communication",
      year: 3,
      credits: 20,
      description:
        "Advanced data visualization techniques and principles of communicating insights effectively",
      prerequisites: ["DS201"],
      learningOutcomes: [
        {
          id: "lo1",
          description: "Create interactive data visualizations",
        },
        {
          id: "lo2",
          description: "Apply principles of visual design and perception",
        },
        {
          id: "lo3",
          description: "Develop dashboard applications",
        },
        {
          id: "lo4",
          description:
            "Communicate technical findings to non-technical audiences",
        },
      ],
      assessments: [
        {
          id: "a1",
          type: "Visualization Portfolio",
          weight: 40,
          description: "Collection of visualization projects",
        },
        {
          id: "a2",
          type: "Dashboard Project",
          weight: 40,
          description: "Interactive dashboard development",
        },
        {
          id: "a3",
          type: "Presentation",
          weight: 20,
          description: "Data storytelling presentation",
        },
      ],
      topics: [
        "Data Visualization Principles",
        "Interactive Visualizations",
        "Dashboard Design",
        "D3.js and Plot.ly",
        "Tableau",
        "Data Storytelling",
        "Visual Perception",
        "Communication Skills",
      ],
      status: "active",
      passingRate: 82,
      averageScore: 75,
    },
  ],
};

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

const ModuleCard: React.FC<{ module: Module }> = ({ module }) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="flex justify-between items-start ">
        <div>
          <CardTitle className="text-lg font-bold">
            {module.code}: {module.name}
          </CardTitle>
          <CardDescription>
            Year {module.year} • {module.credits} Credits
          </CardDescription>
        </div>
        <Badge
          variant={module.status === "active" ? "default" : "secondary"}
          className="bg-main text-white"
        >
          {module.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-sm text-gray-600">{module.description}</p>
        </div>

        {module.prerequisites.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Prerequisites</h4>
            <div className="flex gap-2">
              {module.prerequisites.map((prereq) => (
                <Badge key={prereq} variant="outline">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Learning Outcomes</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {module.learningOutcomes.map((outcome) => (
              <li key={outcome.id}>{outcome.description}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Topics Covered</h4>
          <div className="flex flex-wrap gap-2">
            {module.topics.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Assessment Methods</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {module.assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.type}</TableCell>
                  <TableCell>{assessment.weight}%</TableCell>
                  <TableCell>{assessment.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <BookText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Passing Rate: {module.passingRate}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Average Score: {module.averageScore}%
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

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
    const [yearFilter, setYearFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const isDepartmentDataScience = departmentId.toString() === "2";
    const modules = isDepartmentDataScience
      ? departmentModules.dataScience
      : departmentModules.softwareDevelopment;

    const filteredModules = modules.filter((module) => {
      const matchesSearch =
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear =
        yearFilter === "all" || module.year === parseInt(yearFilter);
      const matchesStatus =
        statusFilter === "all" || module.status === statusFilter;
      return matchesSearch && matchesYear && matchesStatus;
    });

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search modules..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-main hover:bg-second">
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>

        <div className="space-y-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
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
            <div className="text-2xl font-bold"></div>
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
