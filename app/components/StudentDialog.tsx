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

const LogEntryForm: React.FC<{
  newLog: Partial<Log>;
  onLogChange: (log: Partial<Log>) => void;
  onAddLog: () => void;
}> = React.memo(({ newLog, onLogChange, onAddLog }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onLogChange({
      ...newLog,
      comment: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Log Type</Label>
          <Select
            value={newLog.type}
            onValueChange={(value) => onLogChange({ ...newLog, type: value })}
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="Academic Review" className="text-white">
                Academic Review
              </SelectItem>
              <SelectItem value="Attendance" className="text-white">
                Attendance
              </SelectItem>
              <SelectItem value="Behavior" className="text-white">
                Behavior
              </SelectItem>
              <SelectItem value="Counseling" className="text-white">
                Counseling
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white">Staff Member</Label>
          <Select
            value={newLog.staff}
            onValueChange={(value) => onLogChange({ ...newLog, staff: value })}
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="Dr. Smith" className="text-white">
                Dr. Smith
              </SelectItem>
              <SelectItem value="Prof. Jones" className="text-white">
                Prof. Jones
              </SelectItem>
              <SelectItem value="Mrs. Wilson" className="text-white">
                Mrs. Wilson
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white">Comment</Label>
        <textarea
          ref={textareaRef}
          className="w-full min-h-[100px] rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-main"
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
});

LogEntryForm.displayName = "LogEntryForm";

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
  const startDate = new Date(year, 8, 6);
  const endDate = new Date(year + 2, 6, 24);
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
    className="flex items-center justify-between py-2 cursor-pointer hover:bg-neutral-700 rounded-md px-2"
    onClick={onToggle}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onToggle();
      }
    }}
  >
    <h3 className="font-medium text-white">{title}</h3>
    {isExpanded ? (
      <ChevronUp className="w-4 h-4 text-white" />
    ) : (
      <ChevronDown className="w-4 h-4 text-white" />
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${splitName.firstName} ${splitName.lastName}`.trim();
    onSubmit({
      ...formData,
      name: fullName,
    } as Student);
  };

  const FormContent = () => (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="border border-neutral-700 rounded-md p-2">
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
                <Label className="text-white">First Name</Label>
                <Input
                  className="bg-neutral-800 border-neutral-700 text-white"
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
                <Label className="text-white">Last Name</Label>
                <Input
                  className="bg-neutral-800 border-neutral-700 text-white"
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
                <Label className="text-white">Email Address</Label>
                <Input
                  type="email"
                  className="bg-neutral-800 border-neutral-700 text-white"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Phone Number</Label>
                <Input
                  type="tel"
                  className="bg-neutral-800 border-neutral-700 text-white"
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

      <div className="border border-neutral-700 rounded-md p-2">
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
                <Label className="text-white">Course</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, course: value }))
                  }
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem
                      value="Software Development"
                      className="text-white"
                    >
                      Software Development
                    </SelectItem>
                    <SelectItem value="Web Design" className="text-white">
                      Web Design
                    </SelectItem>
                    <SelectItem value="Data Science" className="text-white">
                      Data Science
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Student["status"]) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="active" className="text-white">
                      Active
                    </SelectItem>
                    <SelectItem value="on-leave" className="text-white">
                      On Leave
                    </SelectItem>
                    <SelectItem value="withdrawn" className="text-white">
                      Withdrawn
                    </SelectItem>
                    <SelectItem value="graduated" className="text-white">
                      Graduated
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Student ID</Label>
              <Input
                value={formData.studentId}
                readOnly
                className="bg-neutral-700 border-neutral-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Academic Year</Label>
              <Select
                value={formData.academicYear.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    academicYear: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {Array.from({ length: 5 }, (_, i) => currentYear + i).map(
                    (year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        className="text-white"
                      >
                        {year}-{year + 2}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Enrollment Date</Label>
                <Input
                  type="date"
                  value={formData.enrollmentDate}
                  readOnly
                  className="bg-neutral-700 border-neutral-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Expected Graduation</Label>
                <Input
                  type="date"
                  value={formData.expectedGraduation}
                  readOnly
                  className="bg-neutral-700 border-neutral-600 text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {mode === "edit" && (
        <div className="border border-neutral-700 rounded-md p-2">
          <SectionHeader
            title="Activity Logs"
            isExpanded={expanded.logs}
            onToggle={() =>
              setExpanded((prev) => ({ ...prev, logs: !prev.logs }))
            }
          />
          {expanded.logs && (
            <div className="space-y-4 mt-4">
              <LogEntryForm
                newLog={newLog}
                onLogChange={setNewLog}
                onAddLog={handleAddLog}
              />

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-neutral-200">
                  Previous Logs
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {formData.logs.map((log, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-3 bg-neutral-800 border-neutral-700"
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-white">
                          {log.type}
                        </span>
                        <span className="text-neutral-400">{log.date}</span>
                      </div>
                      <div className="text-sm text-neutral-300 mb-1">
                        Staff: {log.staff}
                      </div>
                      <div className="text-sm text-neutral-200 bg-neutral-900 p-2 rounded">
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
        {trigger || (
          <Button className="bg-main hover:bg-second text-white">CREATE</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Student</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Add a new student to the system. Fill in all required information
            below.
          </DialogDescription>
        </DialogHeader>
        <FormContent />
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-main hover:bg-second text-white"
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
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto bg-neutral-900 border-neutral-800">
        <SheetHeader>
          <SheetTitle className="text-white">Edit Student Profile</SheetTitle>
          <SheetDescription className="text-neutral-400">
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
              className="bg-main hover:bg-second text-white"
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
