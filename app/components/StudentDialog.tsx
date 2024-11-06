/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback, memo, useEffect } from "react";
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

// Memoized Input Component
const MemoizedInput = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    className = "",
    ...props
  }: any) => (
    <div className="space-y-2">
      <Label className="text-gray-700">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        className={`bg-white border-gray-200 text-gray-900 focus:border-main ${className}`}
        {...props}
      />
    </div>
  )
);
MemoizedInput.displayName = "MemoizedInput";

// Memoized Select Component
const MemoizedSelect = memo(
  ({ label, value, onValueChange, children, ...props }: any) => (
    <div className="space-y-2">
      <Label className="text-gray-700">{label}</Label>
      <Select value={value} onValueChange={onValueChange} {...props}>
        <SelectTrigger className="bg-white border-gray-200 text-gray-900">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200">
          {children}
        </SelectContent>
      </Select>
    </div>
  )
);
MemoizedSelect.displayName = "MemoizedSelect";

// Memoized Section Header
const SectionHeader = memo(
  ({ title, isExpanded, onToggle }: SectionHeaderProps) => (
    <div
      className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <h3 className="font-medium text-gray-900">{title}</h3>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 text-gray-600" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-600" />
      )}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

const LogEntryForm = memo(
  ({
    newLog,
    onLogChange,
    onAddLog,
  }: {
    newLog: Partial<Log>;
    onLogChange: (log: Partial<Log>) => void;
    onAddLog: () => void;
  }) => {
    const handleTextChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onLogChange({
          ...newLog,
          comment: e.target.value,
        });
      },
      [newLog, onLogChange]
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Log Type</Label>
            <Select
              value={newLog.type}
              onValueChange={(value) => onLogChange({ ...newLog, type: value })}
            >
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academic Review">Academic Review</SelectItem>
                <SelectItem value="Attendance">Attendance</SelectItem>
                <SelectItem value="Behavior">Behavior</SelectItem>
                <SelectItem value="Counseling">Counseling</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Staff Member</Label>
            <Select
              value={newLog.staff}
              onValueChange={(value) =>
                onLogChange({ ...newLog, staff: value })
              }
            >
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
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
          <Label className="text-gray-700">Comment</Label>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-main"
            value={newLog.comment}
            onChange={handleTextChange}
            onClick={(e) => e.stopPropagation()}
            placeholder="Add log comments..."
          />
        </div>
        <Button
          type="button"
          onClick={onAddLog}
          className="w-full bg-main hover:bg-second text-white"
          disabled={!newLog.type || !newLog.staff || !newLog.comment}
        >
          Add Log Entry
        </Button>
      </div>
    );
  }
);
LogEntryForm.displayName = "LogEntryForm";

// Main Form Content
const FormContent = memo(
  ({
    mode,
    splitName,
    setSplitName,
    formData,
    setFormData,
    expanded,
    setExpanded,
    newLog,
    setNewLog,
    handleAddLog,
    currentYear,
  }: any) => {
    const toggleSection = useCallback((section: keyof typeof expanded) => {
      setExpanded((prev: any) => ({ ...prev, [section]: !prev[section] }));
    }, []);

    const handleFirstNameChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitName((prev: any) => ({
          ...prev,
          firstName: e.target.value,
        }));
      },
      []
    );

    const handleLastNameChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitName((prev: any) => ({
          ...prev,
          lastName: e.target.value,
        }));
      },
      []
    );

    const handleEmailChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: any) => ({ ...prev, email: e.target.value }));
      },
      []
    );

    const handlePhoneChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: any) => ({ ...prev, phone: e.target.value }));
      },
      []
    );

    const handleCourseChange = useCallback((value: string) => {
      setFormData((prev: any) => ({ ...prev, course: value }));
    }, []);

    const handleStatusChange = useCallback((value: Student["status"]) => {
      setFormData((prev: any) => ({ ...prev, status: value }));
    }, []);

    const handleYearChange = useCallback((value: string) => {
      setFormData((prev: any) => ({
        ...prev,
        academicYear: parseInt(value),
      }));
    }, []);

    return (
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="border border-gray-200 rounded-md p-2">
          <SectionHeader
            title="Personal Information"
            isExpanded={expanded.personal}
            onToggle={() => toggleSection("personal")}
          />
          {expanded.personal && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <MemoizedInput
                  label="First Name"
                  value={splitName.firstName}
                  onChange={handleFirstNameChange}
                  required
                />
                <MemoizedInput
                  label="Last Name"
                  value={splitName.lastName}
                  onChange={handleLastNameChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MemoizedInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                />
                <MemoizedInput
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-md p-2">
          <SectionHeader
            title="Academic Information"
            isExpanded={expanded.academic}
            onToggle={() => toggleSection("academic")}
          />
          {expanded.academic && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <MemoizedSelect
                  label="Course"
                  value={formData.course}
                  onValueChange={handleCourseChange}
                >
                  <SelectItem value="Software Development">
                    Software Development
                  </SelectItem>
                  <SelectItem value="Web Design">Web Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                </MemoizedSelect>

                <MemoizedSelect
                  label="Status"
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </MemoizedSelect>
              </div>

              <MemoizedInput
                label="Student ID"
                value={formData.studentId}
                readOnly
                className="bg-gray-50"
              />

              <MemoizedSelect
                label="Academic Year"
                value={formData.academicYear.toString()}
                onValueChange={handleYearChange}
              >
                {Array.from({ length: 5 }, (_, i) => currentYear + i).map(
                  (year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}-{year + 2}
                    </SelectItem>
                  )
                )}
              </MemoizedSelect>

              <div className="grid grid-cols-2 gap-4">
                <MemoizedInput
                  label="Enrollment Date"
                  type="date"
                  value={formData.enrollmentDate}
                  readOnly
                  className="bg-gray-50"
                />
                <MemoizedInput
                  label="Expected Graduation"
                  type="date"
                  value={formData.expectedGraduation}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>

        {mode === "edit" && (
          <div className="border border-gray-200 rounded-md p-2">
            <SectionHeader
              title="Activity Logs"
              isExpanded={expanded.logs}
              onToggle={() => toggleSection("logs")}
            />
            {expanded.logs && (
              <div className="space-y-4 mt-4">
                <LogEntryForm
                  newLog={newLog}
                  onLogChange={setNewLog}
                  onAddLog={handleAddLog}
                />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Previous Logs
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {formData.logs.map((log: Log, index: number) => (
                      <div
                        key={index}
                        className="border rounded-md p-3 bg-gray-50 border-gray-200"
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
                        <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
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
  }
);
FormContent.displayName = "FormContent";

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
    if (mode === "create" && formData.course) {
      const newId = generateStudentId(
        formData.course,
        formData.academicYear,
        existingIds
      );
      setFormData((prev) => ({ ...prev, studentId: newId }));
    }
  }, [formData.course, formData.academicYear, mode, existingIds]);

  useEffect(() => {
    const startDate = new Date(formData.academicYear, 8, 1)
      .toISOString()
      .split("T")[0];
    const endDate = new Date(formData.academicYear + 2, 6, 31)
      .toISOString()
      .split("T")[0];
    setFormData((prev) => ({
      ...prev,
      enrollmentDate: startDate,
      expectedGraduation: endDate,
    }));
  }, [formData.academicYear]);

  const handleAddLog = useCallback(() => {
    if (newLog.type && newLog.staff && newLog.comment) {
      const logEntry: Log = {
        date: new Date().toISOString().split("T")[0],
        type: newLog.type,
        staff: newLog.staff,
        comment: newLog.comment,
      };

      setFormData((prev) => ({
        ...prev,
        logs: [logEntry, ...prev.logs],
      }));

      setNewLog({
        date: new Date().toISOString().split("T")[0],
        type: "",
        staff: "",
        comment: "",
      });
    }
  }, [newLog]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const fullName = `${splitName.firstName} ${splitName.lastName}`.trim();
      onSubmit({
        ...formData,
        name: fullName,
      } as Student);
    },
    [splitName, formData, onSubmit]
  );

  const dialogContent = (
    <>
      <FormContent
        mode={mode}
        splitName={splitName}
        setSplitName={setSplitName}
        formData={formData}
        setFormData={setFormData}
        expanded={expanded}
        setExpanded={setExpanded}
        newLog={newLog}
        setNewLog={setNewLog}
        handleAddLog={handleAddLog}
        currentYear={currentYear}
      />
      {mode === "create" ? (
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-main hover:bg-second text-white"
          >
            Create Student
          </Button>
        </DialogFooter>
      ) : (
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-main mt-4  hover:bg-second text-white"
            >
              Save Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      )}
    </>
  );

  return mode === "create" ? (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-main hover:bg-second text-white">CREATE</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Create New Student
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add a new student to the system. Fill in all required information
            below.
          </DialogDescription>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="bg-main hover:bg-second text-white"
          >
            EDIT
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        className="w-[800px] sm:max-w-[800px] overflow-y-auto bg-white"
        side="right"
      >
        <SheetHeader>
          <SheetTitle className="text-gray-900">
            Edit Student Profile
          </SheetTitle>
          <SheetDescription className="text-gray-500">
            Update student information and academic status.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">{dialogContent}</div>
      </SheetContent>
    </Sheet>
  );
};

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

export default memo(StudentDialog);
