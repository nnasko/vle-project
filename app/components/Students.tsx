/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyStudents from "./EmptyStudents";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Log {
  date: string;
  type: string;
  staff: string;
  comment: string;
}

interface Student {
  id: number;
  name: string;
  course: string;
  avatar: string;
  email: string;
  phone: string;
  studentId: string;
  status: string;
  enrollmentDate: string;
  expectedGraduation: string;
  logs: Log[];
}

interface ExpandedSections {
  personal: boolean;
  academic: boolean;
  logs: boolean;
}

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const Students: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    personal: false,
    academic: false,
    logs: true,
  });

  const students = [
    {
      id: 1,
      name: "Atanas Kyurkchiev",
      course: "Software Development",
      avatar: "/api/placeholder/32/32",
      email: "atanas.k@example.com",
      phone: "+1234567890",
      studentId: "SD2024001",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      logs: [
        {
          date: "2024-03-15",
          type: "Academic Review",
          staff: "Dr. Smith",
          comment: "Excellent progress in frontend development",
        },
        {
          date: "2024-02-20",
          type: "Attendance",
          staff: "Mrs. Wilson",
          comment: "Perfect attendance this month",
        },
      ],
    },
    {
      id: 2,
      name: "Joseph Mitsi",
      course: "Software Development",
      avatar: "/api/placeholder/32/32",
      email: "joseph.m@example.com",
      phone: "+1234567891",
      studentId: "SD2024002",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      logs: [
        {
          date: "2024-03-10",
          type: "Counseling",
          staff: "Prof. Jones",
          comment: "Career guidance session completed",
        },
      ],
    },
    {
      id: 3,
      name: "Oliver Witmond-Harris",
      course: "Data Science",
      avatar: "/api/placeholder/32/32",
      email: "oliver.wh@example.com",
      phone: "+1234567892",
      studentId: "DS2024003",
      status: "on-leave",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      logs: [
        {
          date: "2024-03-01",
          type: "Academic Review",
          staff: "Dr. Smith",
          comment: "Struggling with advanced statistics",
        },
        {
          date: "2024-03-05",
          type: "Attendance",
          staff: "Mrs. Wilson",
          comment: "Medical leave approved",
        },
      ],
    },
    {
      id: 4,
      name: "Jack Ames",
      course: "Web Design",
      avatar: "/api/placeholder/32/32",
      email: "jack.a@example.com",
      phone: "+1234567893",
      studentId: "WD2024004",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      logs: [
        {
          date: "2024-03-12",
          type: "Behavior",
          staff: "Prof. Jones",
          comment: "Outstanding contribution to class projects",
        },
      ],
    },
    {
      id: 5,
      name: "Luke Wilson",
      course: "Software Development",
      avatar: "/api/placeholder/32/32",
      email: "luke.w@example.com",
      phone: "+1234567894",
      studentId: "SD2024005",
      status: "active",
      enrollmentDate: "2024-01-15",
      expectedGraduation: "2025-12-20",
      logs: [
        {
          date: "2024-03-08",
          type: "Academic Review",
          staff: "Dr. Smith",
          comment: "Exceptional performance in backend development",
        },
      ],
    },
  ];

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(
      (prev: ExpandedSections): ExpandedSections => ({
        personal: section === "personal" ? !prev.personal : prev.personal,
        academic: section === "academic" ? !prev.academic : prev.academic,
        logs: section === "logs" ? !prev.logs : prev.logs,
      })
    );
  };

  const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    isExpanded,
    onToggle,
  }) => (
    <div
      className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onToggle();
        }
      }}
    >
      <h3 className="font-medium">{title}</h3>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">MANAGE STUDENTS</h1>
          <Button className="bg-main hover:bg-second">CREATE</Button>
        </div>

        <div className="bg-neutral-700 p-8 rounded-lg">
          <div className="flex gap-4 mb-6">
            <Input placeholder="Enter your search..." className="max-w-md" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software-development">
                  Software Development
                </SelectItem>
                <SelectItem value="web-design">Web Design</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {students.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {students.map((student) => (
                <Card key={student.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-gray-600">
                          {student.course}
                        </div>
                      </div>
                    </div>
                    <Sheet>
                      <SheetTrigger>
                        <Button
                          variant="outline"
                          className="bg-main text-white hover:bg-second"
                        >
                          EDIT
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Edit Student Profile</SheetTitle>
                          <SheetDescription>
                            Update student information and academic status.
                          </SheetDescription>
                        </SheetHeader>

                        <div className="grid gap-4 py-4">
                          {/* Personal Information Section */}
                          <div className="border rounded-md p-2">
                            <SectionHeader
                              title="Personal Information"
                              isExpanded={expandedSections.personal}
                              onToggle={() => toggleSection("personal")}
                            />
                            {expandedSections.personal && (
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="firstName"
                                    className="text-right"
                                  >
                                    First Name
                                  </Label>
                                  <Input
                                    id="firstName"
                                    className="col-span-3"
                                    defaultValue={student.name.split(" ")[0]}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="lastName"
                                    className="text-right"
                                  >
                                    Last Name
                                  </Label>
                                  <Input
                                    id="lastName"
                                    className="col-span-3"
                                    defaultValue={student.name.split(" ")[1]}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="email" className="text-right">
                                    Email
                                  </Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    className="col-span-3"
                                    defaultValue={student.email}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="phone" className="text-right">
                                    Phone
                                  </Label>
                                  <Input
                                    id="phone"
                                    type="tel"
                                    className="col-span-3"
                                    defaultValue={student.phone}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Academic Information Section */}
                          <div className="border rounded-md p-2">
                            <SectionHeader
                              title="Academic Information"
                              isExpanded={expandedSections.academic}
                              onToggle={() => toggleSection("academic")}
                            />
                            {expandedSections.academic && (
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="studentId"
                                    className="text-right"
                                  >
                                    Student ID
                                  </Label>
                                  <Input
                                    id="studentId"
                                    className="col-span-3"
                                    defaultValue={student.studentId}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="course"
                                    className="text-right"
                                  >
                                    Course
                                  </Label>
                                  <div className="col-span-3">
                                    <Select
                                      defaultValue={student.course
                                        .toLowerCase()
                                        .replace(" ", "-")}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="software-development">
                                          Software Development
                                        </SelectItem>
                                        <SelectItem value="web-design">
                                          Web Design
                                        </SelectItem>
                                        <SelectItem value="data-science">
                                          Data Science
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="status"
                                    className="text-right"
                                  >
                                    Status
                                  </Label>
                                  <div className="col-span-3">
                                    <Select defaultValue={student.status}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">
                                          Active
                                        </SelectItem>
                                        <SelectItem value="on-leave">
                                          On Leave
                                        </SelectItem>
                                        <SelectItem value="withdrawn">
                                          Withdrawn
                                        </SelectItem>
                                        <SelectItem value="graduated">
                                          Graduated
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="enrollmentDate"
                                    className="text-right"
                                  >
                                    Enrollment Date
                                  </Label>
                                  <Input
                                    id="enrollmentDate"
                                    type="date"
                                    className="col-span-3"
                                    defaultValue={student.enrollmentDate}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="expectedGraduation"
                                    className="text-right"
                                  >
                                    Expected Graduation
                                  </Label>
                                  <Input
                                    id="expectedGraduation"
                                    type="date"
                                    className="col-span-3"
                                    defaultValue={student.expectedGraduation}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Logging Section */}
                          <div className="border rounded-md p-2">
                            <SectionHeader
                              title="Activity Logs"
                              isExpanded={expandedSections.logs}
                              onToggle={() => toggleSection("logs")}
                            />
                            {expandedSections.logs && (
                              <div className="space-y-4 mt-4">
                                {/* New Log Entry Form */}
                                <div className="grid gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Date</Label>
                                      <Input type="date" className="mt-1" />
                                    </div>
                                    <div>
                                      <Label>Log Type</Label>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="academic-review">
                                            Academic Review
                                          </SelectItem>
                                          <SelectItem value="attendance">
                                            Attendance
                                          </SelectItem>
                                          <SelectItem value="behavior">
                                            Behavior
                                          </SelectItem>
                                          <SelectItem value="counseling">
                                            Counseling
                                          </SelectItem>
                                          <SelectItem value="other">
                                            Other
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Staff Involved</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select staff" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="dr-smith">
                                          Dr. Smith
                                        </SelectItem>
                                        <SelectItem value="prof-jones">
                                          Prof. Jones
                                        </SelectItem>
                                        <SelectItem value="mrs-wilson">
                                          Mrs. Wilson
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label>Comments</Label>
                                    <textarea
                                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 mt-1"
                                      placeholder="Add any relevant comments..."
                                    />
                                  </div>

                                  <Button className="w-full">
                                    Add Log Entry
                                  </Button>
                                </div>
                                {/* Previous Logs */}
                                <div className="space-y-2 mt-6">
                                  <h4 className="font-medium text-gray-700">
                                    Previous Logs
                                  </h4>
                                  <div className="max-h-64 overflow-y-auto space-y-3">
                                    {student.logs?.map((log, index) => (
                                      <div
                                        key={index}
                                        className="border rounded-md p-3 bg-gray-50"
                                      >
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="font-medium text-gray-900">
                                            {log.type}
                                          </span>
                                          <span className="text-gray-500">
                                            {log.date}
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">
                                          Staff: {log.staff}
                                        </div>
                                        <div className="text-sm text-gray-700 bg-white p-2 rounded">
                                          {log.comment}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <SheetFooter>
                          <SheetClose asChild>
                            <Button
                              type="submit"
                              className="bg-main hover:bg-second"
                            >
                              Save Changes
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyStudents />
          )}

          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                className={`w-8 h-8 p-0 ${page === 1 ? "bg-second" : ""}`}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
