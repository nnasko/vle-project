import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  BadgeAlert,
} from "lucide-react";

enum LogType {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  BEHAVIOUR = "BEHAVIOUR",
  ACADEMIC = "ACADEMIC",
  ATTENDANCE = "ATTENDANCE",
  OTHER = "OTHER",
}

interface Log {
  id: string;
  type: LogType;
  title: string;
  description: string;
  teacherId: string;
  teacher: {
    user: {
      name: string;
    };
  };
  createdAt: Date;
}

interface Teacher {
  id: string;
  user: {
    name: string;
    email: string;
  };
  position: string;
  department: {
    name: string;
  };
}

interface StudentLogDialogProps {
  student: {
    id: string;
    user: {
      name: string;
    };
    logs?: Log[];
  };
  trigger?: React.ReactNode;
}

const LOG_TYPE_CONFIG = {
  [LogType.POSITIVE]: {
    color: "text-emerald-500",
    icon: CheckCircle2,
    description: "Recognition of achievement, good behavior, or improvement",
  },
  [LogType.NEGATIVE]: {
    color: "text-red-500",
    icon: AlertCircle,
    description: "Areas of concern or disciplinary issues",
  },
  [LogType.BEHAVIOUR]: {
    color: "text-amber-500",
    icon: BadgeAlert,
    description: "Behavioral observations and incidents",
  },
  [LogType.ACADEMIC]: {
    color: "text-blue-500",
    icon: FileText,
    description: "Academic performance and progress notes",
  },
  [LogType.ATTENDANCE]: {
    color: "text-purple-500",
    icon: Clock,
    description: "Attendance and punctuality records",
  },
  [LogType.OTHER]: {
    color: "text-gray-500",
    icon: FileText,
    description: "Other noteworthy information",
  },
};

export const StudentLogDialog: React.FC<StudentLogDialogProps> = ({
  student,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("add");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>(student.logs || []);

  const [logForm, setLogForm] = useState({
    type: LogType.POSITIVE,
    title: "",
    description: "",
    teacherId: "",
  });

  // Fetch teachers when dialog opens
  useEffect(() => {
    const fetchTeachers = async () => {
      if (!open) return;

      setTeachersLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/teachers");
        if (!response.ok) {
          throw new Error("Failed to fetch teachers");
        }
        const data = await response.json();
        setTeachers(data || []); // Ensure we always set an array
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setError("Failed to load teachers. Please try again.");
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
  }, [open]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/students/${student.id}/logs`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Fetch logs when dialog opens
  useEffect(() => {
    if (open) {
      fetchLogs();
    }
  }, [open, student.id]);

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.teacherId) {
      setError("Please select a teacher");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/students/${student.id}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logForm),
      });

      if (!response.ok) {
        throw new Error("Failed to add log");
      }

      // Reset form and refresh logs
      setLogForm({
        type: LogType.POSITIVE,
        title: "",
        description: "",
        teacherId: "",
      });

      // Fetch updated logs
      await fetchLogs();

      setOpen(false);
    } catch (error) {
      console.error("Error adding log:", error);
      setError("Failed to add log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const LogTypeIcon = ({ type }: { type: LogType }) => {
    const config = LOG_TYPE_CONFIG[type];
    const Icon = config.icon;
    return <Icon className={`w-5 h-5 ${config.color}`} />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-9 px-3">
            Add Log
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Logs - {student.user.name}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Add New Log
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              View Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-4">
            <form onSubmit={handleSubmitLog} className="space-y-4">
              <div className="space-y-2">
                <Label>Log Type</Label>
                <Select
                  value={logForm.type}
                  onValueChange={(value: LogType) =>
                    setLogForm((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select log type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LogType).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        <div className="flex items-center gap-2">
                          <LogTypeIcon type={value} />
                          <span>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  {LOG_TYPE_CONFIG[logForm.type].description}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Teacher</Label>
                <Select
                  value={logForm.teacherId}
                  onValueChange={(value) =>
                    setLogForm((prev) => ({ ...prev, teacherId: value }))
                  }
                  disabled={teachersLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        teachersLoading
                          ? "Loading teachers..."
                          : "Select teacher..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        {teachersLoading
                          ? "Loading..."
                          : error
                          ? "Failed to load teachers"
                          : "No teachers available"}
                      </SelectItem>
                    ) : (
                      teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          <div className="flex flex-col">
                            <span>{teacher.user.name}</span>
                            <span className="text-sm text-gray-500">
                              {teacher.position} • {teacher.department.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={logForm.title}
                  onChange={(e) =>
                    setLogForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Brief summary of the log"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={logForm.description}
                  onChange={(e) =>
                    setLogForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Provide detailed information..."
                  className="h-32"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-main hover:bg-second text-white"
                  disabled={loading || teachersLoading}
                >
                  {loading ? "Adding Log..." : "Add Log"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="view" className="mt-4">
            <div className="space-y-4">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-neutral-50 p-4 rounded-lg border border-neutral-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <LogTypeIcon type={log.type} />
                        <div>
                          <div className="font-medium">{log.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            By {log.teacher.user.name} •{" "}
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded border border-neutral-100">
                      {log.description}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No logs found for this student
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
