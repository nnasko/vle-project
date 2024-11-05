"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Module {
  id: string;
  name: string;
  code: string;
}

interface Department {
  id: number;
  name: string;
  head: string;
  staffCount: number;
  studentCount: number;
  modules: Module[];
  status: "active" | "inactive";
  description?: string;
}

interface EditDepartmentFormProps {
  department: Department;
  onSave: (updatedDepartment: Department) => void;
  onClose: () => void;
}

const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({
  department,
  onSave,
  onClose,
}) => {
  const [editedDepartment, setEditedDepartment] = useState<Department>({
    ...department,
  });

  const handleSave = () => {
    onSave(editedDepartment);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Department Name</Label>
        <Input
          value={editedDepartment.name}
          onChange={(e) =>
            setEditedDepartment({ ...editedDepartment, name: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label>Department Head</Label>
        <Select
          value={editedDepartment.head}
          onValueChange={(value) =>
            setEditedDepartment({ ...editedDepartment, head: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department head" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
            <SelectItem value="Prof. Michael Chen">
              Prof. Michael Chen
            </SelectItem>
            <SelectItem value="Dr. James Wilson">Dr. James Wilson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={editedDepartment.status}
          onValueChange={(value: "active" | "inactive") =>
            setEditedDepartment({ ...editedDepartment, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-main hover:bg-second">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Software Development",
      head: "Dr. Sarah Johnson",
      staffCount: 12,
      studentCount: 156,
      modules: [
        { id: "1", code: "SD101", name: "Introduction to Programming" },
        { id: "2", code: "SD201", name: "Web Development" },
        { id: "3", code: "SD301", name: "Mobile App Development" },
      ],
      status: "active",
      description:
        "Leading department for software engineering and development practices.",
    },
    {
      id: 2,
      name: "Data Science",
      head: "Prof. Michael Chen",
      staffCount: 8,
      studentCount: 98,
      modules: [
        { id: "4", code: "DS101", name: "Data Analysis Fundamentals" },
        { id: "5", code: "DS201", name: "Machine Learning" },
        { id: "6", code: "DS301", name: "Big Data Analytics" },
      ],
      status: "active",
      description:
        "Focused on data analysis, machine learning, and statistical modeling.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleUpdateDepartment = (updatedDepartment: Department) => {
    setDepartments(
      departments.map((dept) =>
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    );
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">MANAGE DEPARTMENTS</h1>
            <p className="text-gray-500">
              Organize and manage academic departments
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-main hover:bg-second">
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full max-w-xl">
              {/* Add department form - similar structure to EditDepartmentForm */}
            </SheetContent>
          </Sheet>
        </div>

        <div className="bg-neutral-700 p-8 rounded-lg">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search departments..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredDepartments.map((department) => (
              <Card key={department.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link
                      href={`/departments/${department.id}`}
                      className="group flex items-center gap-2 hover:text-main transition-colors"
                      prefetch
                    >
                      <h3 className="text-lg font-semibold group-hover:text-main">
                        {department.name}
                      </h3>
                      <Badge
                        className="bg-main text-white"
                        variant={
                          department.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {department.status}
                      </Badge>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Head: {department.head}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit Department</SheetTitle>
                        </SheetHeader>
                        <EditDepartmentForm
                          department={department}
                          onSave={handleUpdateDepartment}
                          onClose={() => {}} // Add sheet close functionality
                        />
                      </SheetContent>
                    </Sheet>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Department</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete {department.name}?
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="ghost">Cancel</Button>
                          <Button variant="destructive">Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Staff: {department.staffCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Students: {department.studentCount}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Modules</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {department.modules.map((module) => (
                      <Badge key={module.id} variant="secondary">
                        {module.code} - {module.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
