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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Plus, Users, ChevronRight, HomeIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  cohorts: string[];
  attachments: string[];
  submissionCount: number;
  status: "active" | "draft" | "closed";
}

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "React Component Development",
      description:
        "Create a reusable component library using React and TypeScript",
      dueDate: "2024-11-25",
      totalPoints: 100,
      cohorts: ["Software Development 2024A", "Web Development 2024B"],
      attachments: ["assignment_brief.pdf", "component_requirements.doc"],
      submissionCount: 15,
      status: "active",
    },
    {
      id: 2,
      title: "Database Design Project",
      description: "Design and implement a normalized database schema",
      dueDate: "2024-11-28",
      totalPoints: 75,
      cohorts: ["Software Development 2024A"],
      attachments: ["database_requirements.pdf"],
      submissionCount: 8,
      status: "active",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "draft":
        return "bg-yellow-500";
      case "closed":
        return "bg-neutral-500";
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
            <BreadcrumbPage>Assignments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">ASSIGNMENTS</h1>
            <p className="text-neutral-500">
              Manage and track student assignments
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-main hover:bg-second">
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Create a new assignment and assign it to cohorts
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Assignment title" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Assignment description and instructions" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Points</Label>
                    <Input type="number" min="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assign to Cohorts</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cohorts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sd2024a">
                        Software Development 2024A
                      </SelectItem>
                      <SelectItem value="wd2024b">
                        Web Development 2024B
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="flex items-center gap-2">
                    <Input type="file" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-main hover:bg-second">
                  Create Assignment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-neutral-700">
            <div className="flex gap-4 mb-4">
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Search assignments..." className="max-w-sm" />
            </div>

            <Table>
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead className="text-white">Assignment</TableHead>
                  <TableHead className="text-white">Due Date</TableHead>
                  <TableHead className="text-white">Cohorts</TableHead>
                  <TableHead className="text-white">Submissions</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          {assignment.title}
                        </span>
                        <span className="text-sm text-neutral-300">
                          {assignment.description}
                        </span>
                        {assignment.attachments.length > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <FileText className="w-4 h-4 text-neutral-300" />
                            <span className="text-sm text-neutral-500">
                              {assignment.attachments.length} attachments
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-neutral-200">
                          {format(new Date(assignment.dueDate), "PPP")}
                        </span>
                        <span
                          className={`text-sm ${
                            getDaysRemaining(assignment.dueDate) < 3
                              ? "text-red-500"
                              : "text-neutral-400"
                          }`}
                        >
                          {getDaysRemaining(assignment.dueDate)} days remaining
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {assignment.cohorts.map((cohort) => (
                          <Badge
                            key={cohort}
                            variant="outline"
                            className="bg-main text-white font-extralight"
                          >
                            {cohort}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-neutral-400" />
                        <span className="text-white">
                          {assignment.submissionCount} submissions
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(
                          assignment.status
                        )} text-white`}
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/assignments/${assignment.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-neutral-800"
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
