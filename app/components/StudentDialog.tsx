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
import { Loader2, Plus } from "lucide-react";
import { GradeLevel } from "@prisma/client";

interface Cohort {
  id: string;
  name: string;
  course: {
    name: string;
  };
}

interface StudentDialogProps {
  mode: "create" | "edit";
  student?: {
    id: string;
    user: {
      name: string;
      email: string;
      phone: string | null;
    };
    currentGrade: GradeLevel;
    cohortId?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  trigger?: React.ReactNode; // Optional custom trigger
}

const StudentDialog: React.FC<StudentDialogProps> = ({
  mode,
  student,
  onSubmit,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: student?.user.name || "",
    email: student?.user.email || "",
    phone: student?.user.phone || "",
    currentGrade: student?.currentGrade || GradeLevel.FIRST_YEAR,
    cohortId: student?.cohortId || undefined,
    password: "", // Only used for create mode
  });

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open && student && mode === "edit") {
      setFormData({
        name: student.user.name,
        email: student.user.email,
        phone: student.user.phone || "",
        currentGrade: student.currentGrade,
        cohortId: student.cohortId,
        password: "",
      });
    }
  }, [open, student, mode]);

  // Fetch available cohorts
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cohorts/available");
        if (response.ok) {
          const data = await response.json();
          setCohorts(data);
        }
      } catch (error) {
        console.error("Error fetching cohorts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCohorts();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      let submitData;
      if (mode === "edit" && student) {
        // For edit mode, only include fields that can be updated
        submitData = {
          id: student.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          currentGrade: formData.currentGrade,
          cohortId: formData.cohortId,
        };
      } else {
        // For create mode, include all fields
        submitData = formData;
      }

      await onSubmit(submitData);
      setOpen(false); // Close dialog on successful submit
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-main hover:bg-second text-white">
            <Plus className="w-4 h-4 mr-2" />
            {mode === "create" ? "Add Student" : "Edit Student"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {mode === "create" ? "Add New Student" : "Edit Student"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {mode === "create"
              ? "Add a new student to the system. Fill in all required information below."
              : "Update student information and academic status."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              disabled={mode === "edit"} // Email cannot be changed in edit mode
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Grade Level</Label>
            <Select
              value={formData.currentGrade}
              onValueChange={(value: GradeLevel) =>
                setFormData((prev) => ({ ...prev, currentGrade: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST_YEAR">First Year</SelectItem>
                <SelectItem value="SECOND_YEAR">Second Year</SelectItem>
                <SelectItem value="THIRD_YEAR">Third Year</SelectItem>
                <SelectItem value="FOURTH_YEAR">Fourth Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "create" && (
            <div className="space-y-2">
              <Label>Initial Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required={mode === "create"}
              />
              <p className="text-sm text-gray-500">
                Student will be prompted to change this on first login
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Assign to Cohort</Label>
            <Select
              value={formData.cohortId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, cohortId: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loading ? "Loading cohorts..." : "Select cohort"}
                />
              </SelectTrigger>
              <SelectContent>
                {cohorts.map((cohort) => (
                  <SelectItem key={cohort.id} value={cohort.id}>
                    {cohort.name} - {cohort.course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-main hover:bg-second text-white"
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "create" ? "Adding..." : "Saving..."}
                </>
              ) : (
                <>{mode === "create" ? "Add Student" : "Save Changes"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;
