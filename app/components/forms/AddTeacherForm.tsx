// components/forms/AddTeacherForm.tsx
import React from "react";
import { zodResolver } from "@hookform/resolve";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";

const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().min(2, "Position is required"),
  specializations: z.string().transform((str) => str.split(",")),
  qualifications: z.string().transform((str) => str.split(",")),
  biography: z.string().optional(),
  officeHours: z.string().optional(),
});

export function AddTeacherForm({
  departmentId,
  onSuccess,
}: {
  departmentId: string;
  onSuccess: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      specializations: "",
      qualifications: "",
      biography: "",
      officeHours: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof teacherSchema>) => {
    try {
      const response = await fetch(
        `/api/departments/${departmentId}/teachers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create teacher");
      }

      toast.success("Teacher added successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error("Failed to add teacher");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input {...form.register("email")} type="email" />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Phone (Optional)</Label>
        <Input {...form.register("phone")} />
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <Input {...form.register("position")} />
        {form.formState.errors.position && (
          <p className="text-sm text-red-500">
            {form.formState.errors.position.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Specializations (comma-separated)</Label>
        <Input {...form.register("specializations")} />
      </div>

      <div className="space-y-2">
        <Label>Qualifications (comma-separated)</Label>
        <Input {...form.register("qualifications")} />
      </div>

      <div className="space-y-2">
        <Label>Biography</Label>
        <Textarea {...form.register("biography")} />
      </div>

      <div className="space-y-2">
        <Label>Office Hours</Label>
        <Input {...form.register("officeHours")} />
      </div>

      <Button type="submit" className="w-full">
        Add Teacher
      </Button>
    </form>
  );
}
