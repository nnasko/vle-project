// components/forms/AddCohortForm.tsx
import React from "react";
import { zodResolver } from "@hookform/resolve";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const cohortSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  courseId: z.string().min(1, "Course is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

interface CourseOption {
  id: string;
  name: string;
}

interface TeacherOption {
  id: string;
  name: string;
}

interface AddCohortFormProps {
  departmentId: string;
  courses: CourseOption[];
  teachers: TeacherOption[];
  onSuccess: () => void;
}

export function AddCohortForm({
  departmentId,
  courses,
  teachers,
  onSuccess,
}: AddCohortFormProps) {
  const form = useForm({
    resolver: zodResolver(cohortSchema),
    defaultValues: {
      name: "",
      courseId: "",
      teacherId: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof cohortSchema>) => {
    try {
      const response = await fetch(`/api/departments/${departmentId}/cohorts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create cohort");
      }

      toast.success("Cohort created successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating cohort:", error);
      toast.error("Failed to create cohort");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Cohort Name</Label>
        <Input {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Course</Label>
        <Select
          onValueChange={(value) => form.setValue("courseId", value)}
          value={form.watch("courseId")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.courseId && (
          <p className="text-sm text-red-500">
            {form.formState.errors.courseId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Teacher</Label>
        <Select
          onValueChange={(value) => form.setValue("teacherId", value)}
          value={form.watch("teacherId")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.teacherId && (
          <p className="text-sm text-red-500">
            {form.formState.errors.teacherId.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" {...form.register("startDate")} />
          {form.formState.errors.startDate && (
            <p className="text-sm text-red-500">
              {form.formState.errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input type="date" {...form.register("endDate")} />
          {form.formState.errors.endDate && (
            <p className="text-sm text-red-500">
              {form.formState.errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Cohort
      </Button>
    </form>
  );
}
