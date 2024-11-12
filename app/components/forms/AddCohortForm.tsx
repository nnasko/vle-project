// components/AddCohortForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCohort } from "@/services/departmentApi";
import { toast } from "react-toastify";

interface AddCohortFormProps {
  departmentId: string;
  departmentName: string;
  teacherId: string;
  teacherName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddCohortForm: React.FC<AddCohortFormProps> = ({
  departmentId,
  departmentName,
  teacherId,
  teacherName,
  onSuccess,
  onCancel,
}) => {
  const currentYear = new Date().getFullYear();
  const shortYear = currentYear.toString().slice(-2);
  const nextYear = (currentYear + 1).toString().slice(-2);

  const [formData, setFormData] = useState({
    // Generate a default cohort code like "SD2401" for Software Development 2024 Group 1
    name: `${departmentName
      .split(" ")
      .map((word) => word[0])
      .join("")}${shortYear}01`,
    startDate: "",
    endDate: "",
    maxStudents: "30", // Default max students
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCohort(departmentId, {
        ...formData,
        teacherId,
      });
      toast.success("Cohort created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error creating cohort:", error);
      toast.error("Failed to create cohort");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Cohort Code</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., SD2401"
          required
        />
        <p className="text-sm text-gray-500">
          Suggested format: Department Code + Year + Group Number (e.g., SD2401)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            min={formData.startDate}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxStudents">Maximum Students</Label>
        <Input
          id="maxStudents"
          type="number"
          value={formData.maxStudents}
          onChange={(e) =>
            setFormData({ ...formData, maxStudents: e.target.value })
          }
          min="1"
          required
        />
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-900">Cohort Details</h4>
        <div className="mt-2 space-y-2 text-sm text-gray-600">
          <p>Department: {departmentName}</p>
          <p>Teacher: {teacherName}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-main hover:bg-second"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Cohort"}
        </Button>
      </div>
    </form>
  );
};
