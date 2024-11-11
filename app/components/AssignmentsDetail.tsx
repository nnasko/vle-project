"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  DownloadCloud,
  FileText,
  Calendar,
  Clock,
  Users,
  GraduationCap,
  Link as LinkIcon,
  FileUp,
  HomeIcon,
  Eye,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Submission {
  id: number;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  submissionDate: string;
  status: "submitted" | "late" | "not_submitted" | "graded";
  grade?: number;
  feedback?: string;
  files: string[];
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  cohorts: string[];
  attachments: string[];
  status: "active" | "draft" | "closed";
  submissions: Submission[];
}

const AssignmentDetailPage = () => {
  // Mock data for the assignment
  const [assignment, setAssignment] = useState<Assignment>({
    id: 1,
    title: "React Component Development",
    description: `Create a reusable component library using React and TypeScript. 

Requirements:
- Implement at least 5 reusable components
- Include proper TypeScript types and interfaces
- Write unit tests for each component
- Document usage examples
- Create a storybook for component showcase`,
    dueDate: "2024-03-25",
    totalPoints: 100,
    cohorts: ["Software Development 2024A", "Web Development 2024B"],
    attachments: [
      "assignment_brief.pdf",
      "component_requirements.doc",
      "example_components.zip",
    ],
    status: "active",
    submissions: [
      {
        id: 1,
        studentId: 1,
        studentName: "John Doe",
        studentAvatar: "/api/placeholder/32/32",
        submissionDate: "2024-11-20",
        status: "graded",
        grade: 95,
        feedback:
          "Excellent work! Great component architecture and documentation.",
        files: ["components.zip", "documentation.pdf"],
      },
      {
        id: 2,
        studentId: 2,
        studentName: "Jane Smith",
        studentAvatar: "/api/placeholder/32/32",
        submissionDate: "2024-11-22",
        status: "submitted",
        files: ["submission.zip"],
      },
      {
        id: 3,
        studentId: 3,
        studentName: "Mike Johnson",
        studentAvatar: "/api/placeholder/32/32",
        submissionDate: "2024-11-26",
        status: "late",
        files: ["late_submission.zip"],
      },
      {
        id: 4,
        studentId: 4,
        submissionDate: "",
        studentName: "Sarah Williams",
        studentAvatar: "/api/placeholder/32/32",
        status: "not_submitted",
        files: [],
      },
    ],
  });

  const getStatusColor = (status: Submission["status"]) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500";
      case "late":
        return "bg-yellow-500";
      case "not_submitted":
        return "bg-red-500";
      case "graded":
        return "bg-emerald-500";
    }
  };

  const getStatusIcon = (status: Submission["status"]) => {
    switch (status) {
      case "submitted":
        return FileUp;
      case "late":
        return AlertCircle;
      case "not_submitted":
        return XCircle;
      case "graded":
        return CheckCircle2;
    }
  };

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center gap-2">
              <Link href="/">
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/assignments">Assignments</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{assignment.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Assignment Details */}
          <div className="col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {assignment.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Due {format(new Date(assignment.dueDate), "PPP")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{assignment.totalPoints} points</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {assignment.cohorts.map((cohort) => (
                      <Badge
                        key={cohort}
                        variant="outline"
                        className="bg-neutral-800"
                      >
                        {cohort}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge
                  className={`${getStatusColor(assignment.status)} text-white`}
                >
                  {assignment.status}
                </Badge>
              </div>

              <div className="prose prose-neutral">
                <div className="whitespace-pre-wrap">
                  {assignment.description}
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                <div className="space-y-2">
                  {assignment.attachments.map((file) => (
                    <div
                      key={file}
                      className="flex items-center justify-between p-2 bg-neutral-800 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-400" />
                        <span>{file}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <DownloadCloud className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Submissions Table */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Submissions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignment.submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={submission.studentAvatar} />
                            <AvatarFallback>
                              {submission.studentName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {submission.studentName}
                            </div>
                            {submission.files.length > 0 && (
                              <div className="text-sm text-neutral-500">
                                {submission.files.length} files
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            submission.status
                          )} text-white`}
                        >
                          <div className="flex items-center gap-1">
                            {React.createElement(
                              getStatusIcon(submission.status),
                              { className: "w-3 h-3" }
                            )}
                            <span>{submission.status.replace("_", " ")}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {submission.submissionDate
                          ? format(new Date(submission.submissionDate), "PPP")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {submission.grade !== undefined ? (
                          <span className="font-medium">
                            {submission.grade}/{assignment.totalPoints}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2"
                              disabled={submission.status === "not_submitted"}
                            >
                              View
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Submission Details</DialogTitle>
                              <DialogDescription>
                                Review submission and provide feedback
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-4 pb-4 border-b">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={submission.studentAvatar} />
                                  <AvatarFallback>
                                    {submission.studentName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">
                                    {submission.studentName}
                                  </h3>
                                  <p className="text-sm text-neutral-500">
                                    Submitted{" "}
                                    {submission.submissionDate &&
                                      format(
                                        new Date(submission.submissionDate),
                                        "PPP"
                                      )}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <Label>Submitted Files</Label>
                                <div className="space-y-2 mt-2">
                                  {submission.files.map((file) => (
                                    <div
                                      key={file}
                                      className="flex items-center justify-between p-2 bg-neutral-800 rounded-md"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-neutral-400" />
                                        <span>{file}</span>
                                      </div>
                                      <Button variant="ghost" size="sm">
                                        <DownloadCloud className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Grade</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max={assignment.totalPoints}
                                  value={submission.grade}
                                  placeholder={`Out of ${assignment.totalPoints}`}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Feedback</Label>
                                <Textarea
                                  value={submission.feedback}
                                  placeholder="Provide feedback on the submission..."
                                  rows={4}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Save Draft</Button>
                              <Button className="bg-main hover:bg-second">
                                Save & Publish Grade
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Overview</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500">Total Students</p>
                    <p className="text-2xl font-bold">
                      {assignment.submissions.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500">Submitted</p>
                    <p className="text-2xl font-bold">
                      {
                        assignment.submissions.filter(
                          (s) =>
                            s.status === "submitted" || s.status === "graded"
                        ).length
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500">Average Grade</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        assignment.submissions
                          .filter((s) => s.grade !== undefined)
                          .reduce((acc, s) => acc + (s.grade || 0), 0) /
                          assignment.submissions.filter(
                            (s) => s.grade !== undefined
                          ).length
                      ) || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500">Late Submissions</p>
                    <p className="text-2xl font-bold">
                      {
                        assignment.submissions.filter(
                          (s) => s.status === "late"
                        ).length
                      }
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Submission Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Graded</span>
                      </div>
                      <span className="font-medium">
                        {
                          assignment.submissions.filter(
                            (s) => s.status === "graded"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileUp className="w-4 h-4 text-blue-500" />
                        <span>Submitted</span>
                      </div>
                      <span className="font-medium">
                        {
                          assignment.submissions.filter(
                            (s) => s.status === "submitted"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span>Late</span>
                      </div>
                      <span className="font-medium">
                        {
                          assignment.submissions.filter(
                            (s) => s.status === "late"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>Not Submitted</span>
                      </div>
                      <span className="font-medium">
                        {
                          assignment.submissions.filter(
                            (s) => s.status === "not_submitted"
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <Button className="w-full bg-main hover:bg-second">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Download All Submissions
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Student View
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
