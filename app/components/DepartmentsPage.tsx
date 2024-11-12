// app/departments/page.tsx
"use client";
import React, { useState, useEffect } from "react";
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
  HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Module {
  id: string;
  name: string;
  code: string;
}

interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  studentCount: number;
  modules: Module[];
  status: "active" | "inactive";
  description?: string;
}

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDepartment = async (formData: FormData) => {
    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          headOfDepartment: formData.get("head"),
          status: "active",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create department");
      }

      toast.success("Department created successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error("Failed to create department");
    }
  };

  const handleUpdateDepartment = async (updatedDepartment: Department) => {
    try {
      const response = await fetch(`/api/departments/${updatedDepartment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDepartment),
      });

      if (!response.ok) {
        throw new Error("Failed to update department");
      }

      toast.success("Department updated successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department");
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete department");
      }

      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Departments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

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
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Department</SheetTitle>
              </SheetHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateDepartment(new FormData(e.currentTarget));
                }}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <Label>Department Name</Label>
                  <Input name="name" required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input name="description" />
                </div>
                <div className="space-y-2">
                  <Label>Department Head</Label>
                  <Input name="head" required />
                </div>
                <Button type="submit" className="w-full">
                  Create Department
                </Button>
              </form>
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
                        {/* Add edit form similar to create form */}
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
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDeleteDepartment(department.id)
                            }
                          >
                            Delete
                          </Button>
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

                {department.modules.length > 0 && (
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
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
