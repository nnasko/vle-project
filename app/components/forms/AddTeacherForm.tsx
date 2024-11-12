// components/AddTeacherForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTeacher } from "@/services/departmentApi";
import { toast } from "react-toastify";

interface AddTeacherFormProps {
  departmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddTeacherForm: React.FC<AddTeacherFormProps> = ({
  departmentId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    specializations: [] as string[],
    qualifications: [] as string[],
    biography: "",
    officeHours: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTeacher(departmentId, formData);
      toast.success("Teacher added successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add teacher");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Select
          onValueChange={(value) =>
            setFormData({ ...formData, position: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="head">Department Head</SelectItem>
            <SelectItem value="senior">Senior Lecturer</SelectItem>
            <SelectItem value="lecturer">Lecturer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-main hover:bg-second"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Teacher"}
        </Button>
      </div>
    </form>
  );
};
