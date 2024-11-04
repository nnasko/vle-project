"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ChevronDown, ChevronUp } from "lucide-react";

interface Log {
  date: string;
  type: string;
  staff: string;
  comment: string;
}

interface Student {
  id?: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: "active" | "on-leave" | "withdrawn" | "graduated";
  academicYear: number;
  studentId: string;
  enrollmentDate: string;
  expectedGraduation: string;
  avatar: string;
  logs: Log[];
}

interface ExpandedSections {
  personal: boolean;
  academic: boolean;
  logs: boolean;
}

interface StudentDialogProps {
  mode: "create" | "edit";
  student?: Student;
  existingIds: string[];
  onSubmit: (studentData: Student) => void;
  trigger?: React.ReactNode;
  expandedSections?: ExpandedSections;
}

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const generateStudentId = (
  course: string,
  year: number,
  existingIds: string[]
): string => {
  const prefix = course
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const relevantIds = existingIds
    .filter((id) => id.startsWith(prefix + year))
    .map((id) => parseInt(id.slice(-3)));

  const maxNum = relevantIds.length > 0 ? Math.max(...relevantIds) : 0;
  const nextNum = (maxNum + 1).toString().padStart(3, "0");

  return `${prefix}${year}${nextNum}`;
};

const getAcademicYearDates = (year: number) => {
  const startDate = new Date(year, 8, 1); // September 1st
  const endDate = new Date(year + 2, 6, 31); // July 31st, two years later
  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
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

const StudentDialog: React.FC<StudentDialogProps> = ({
  mode,
  student,
  existingIds,
  onSubmit,
  trigger,
  expandedSections: initialExpandedSections,
}) => {
  const currentYear = new Date().getFullYear();
  const [splitName, setSplitName] = useState({
    firstName: student?.name?.split(" ")[0] || "",
    lastName: student?.name?.split(" ").slice(1).join(" ") || "",
  });

  const [formData, setFormData] = useState<Omit<Student, "name">>({
    id: student?.id,
    email: student?.email || "",
    phone: student?.phone || "",
    course: student?.course || "",
    status: student?.status || "active",
    academicYear: student?.academicYear || currentYear,
    studentId: student?.studentId || "",
    enrollmentDate: student?.enrollmentDate || "",
    expectedGraduation: student?.expectedGraduation || "",
    avatar: student?.avatar || "/api/placeholder/32/32",
    logs: student?.logs || [],
  });

  const [newLog, setNewLog] = useState<Partial<Log>>({
    date: new Date().toISOString().split("T")[0],
    type: "",
    staff: "",
    comment: "",
  });

  const [expanded, setExpanded] = useState<ExpandedSections>(
    initialExpandedSections || {
      personal: true,
      academic: true,
      logs: false,
    }
  );

  useEffect(() => {
    if (initialExpandedSections) {
      setExpanded(initialExpandedSections);
    }
  }, [initialExpandedSections]);

  useEffect(() => {
    const { startDate, endDate } = getAcademicYearDates(formData.academicYear);
    setFormData((prev) => ({
      ...prev,
      enrollmentDate: startDate,
      expectedGraduation: endDate,
    }));
  }, [formData.academicYear]);

  useEffect(() => {
    if (mode === "create" && formData.course) {
      const newId = generateStudentId(
        formData.course,
        formData.academicYear,
        existingIds
      );
      setFormData((prev) => ({ ...prev, studentId: newId }));
    }
  }, [formData.course, formData.academicYear, mode, existingIds]);

  const handleAddLog = () => {
    if (newLog.type && newLog.staff && newLog.comment) {
      setFormData((prev) => ({
        ...prev,
        logs: [{ ...(newLog as Log) }, ...prev.logs],
      }));
      setNewLog({
        date: new Date().toISOString().split("T")[0],
        type: "",
        staff: "",
        comment: "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${splitName.firstName} ${splitName.lastName}`.trim();
    onSubmit({
      ...formData,
      name: fullName,
    });
  };

  const FormContent = () => (
    <form className="space-y-6">
      <div className="border rounded-md p-2">
        <SectionHeader
          title="Personal Information"
          isExpanded={expanded.personal}
          onToggle={() =>
            setExpanded((prev) => ({ ...prev, personal: !prev.personal }))
          }
        />
        {expanded.personal && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={splitName.firstName}
                  onChange={(e) =>
                    setSplitName((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={splitName.lastName}
                  onChange={(e) =>
                    setSplitName((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-md p-2">
        <SectionHeader
          title="Academic Information"
          isExpanded={expanded.academic}
          onToggle={() =>
            setExpanded((prev) => ({ ...prev, academic: !prev.academic }))
          }
        />
        {expanded.academic && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, course: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Development">
                      Software Development
                    </SelectItem>
                    <SelectItem value="Web Design">Web Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Student["status"]) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select
                value={formData.academicYear.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    academicYear: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentYear + i).map(
                    (year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}-{year + 2}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                <Input
                  id="expectedGraduation"
                  type="date"
                  value={formData.expectedGraduation}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {mode === "edit" && (
        <div className="border rounded-md p-2">
          <SectionHeader
            title="Activity Logs"
            isExpanded={expanded.logs}
            onToggle={() =>
              setExpanded((prev) => ({ ...prev, logs: !prev.logs }))
            }
          />
          {expanded.logs && (
            <div className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Log Type</Label>
                    <Select
                      value={newLog.type}
                      onValueChange={(value) =>
                        setNewLog((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic Review">
                          Academic Review
                        </SelectItem>
                        <SelectItem value="Attendance">Attendance</SelectItem>
                        <SelectItem value="Behavior">Behavior</SelectItem>
                        <SelectItem value="Counseling">Counseling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Staff Member</Label>
                    <Select
                      value={newLog.staff}
                      onValueChange={(value) =>
                        setNewLog((prev) => ({ ...prev, staff: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                        <SelectItem value="Prof. Jones">Prof. Jones</SelectItem>
                        <SelectItem value="Mrs. Wilson">Mrs. Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                    value={newLog.comment}
                    onChange={(e) =>
                      setNewLog((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Add log comments..."
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddLog}
                  className="w-full bg-main hover:bg-second"
                >
                  Add Log Entry
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">
                  Previous Logs
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {formData.logs.map((log, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-3 bg-gray-50"
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-900">
                          {log.type}
                        </span>
                        <span className="text-gray-500">{log.date}</span>
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
      )}
    </form>
  );

  return mode === "create" ? (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button className="bg-main hover:bg-second">CREATE</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
          <DialogDescription>
            Add a new student to the system. Fill in all required information
            below.
          </DialogDescription>
        </DialogHeader>
        <FormContent />
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-main hover:bg-second"
          >
            Create Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="bg-main text-white hover:bg-second"
          >
            EDIT
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Student Profile</SheetTitle>
          <SheetDescription>
            Update student information and academic status.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <FormContent />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-main hover:bg-second"
            >
              Save Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default StudentDialog;
