// components/StaffTab.tsx
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, Plus } from "lucide-react";
import { Department, Teacher } from "@/types/department";
import { AddTeacherForm } from "./forms/AddTeacherForm";
import { AddCohortForm } from "./forms/AddCohortForm";

interface StaffTabProps {
  department: Department;
  staffSearch: string;
  setStaffSearch: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  onTeacherAdded: () => void;
}

const StaffTab: React.FC<StaffTabProps> = ({
  department,
  staffSearch,
  setStaffSearch,
  roleFilter,
  setRoleFilter,
  onTeacherAdded,
}) => {
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAddCohortOpen, setIsAddCohortOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );

  const filteredTeachers = department.teachers.filter((teacher: Teacher) => {
    const matchesSearch =
      teacher.user.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      teacher.user.email.toLowerCase().includes(staffSearch.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      teacher.position.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleAddTeacherSuccess = () => {
    setIsAddTeacherOpen(false);
    onTeacherAdded();
  };

  const handleAddCohortSuccess = () => {
    setIsAddCohortOpen(false);
    setSelectedTeacherId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Input
            placeholder="Search staff..."
            value={staffSearch}
            onChange={(e) => setStaffSearch(e.target.value)}
            className="w-64"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="head">Department Head</SelectItem>
              <SelectItem value="senior">Senior Lecturer</SelectItem>
              <SelectItem value="lecturer">Lecturer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
          <DialogTrigger asChild>
            <Button className="bg-main hover:bg-second">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Add a new teacher to the department
              </DialogDescription>
            </DialogHeader>
            <AddTeacherForm
              departmentId={department.id}
              onSuccess={handleAddTeacherSuccess}
              onCancel={() => setIsAddTeacherOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Modules</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teacher.user.avatar} />
                    <AvatarFallback>{teacher.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{teacher.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {teacher.employeeId}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{teacher.position}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-4 w-4" /> {teacher.user.email}
                  </div>
                  {teacher.user.phone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-4 w-4" /> {teacher.user.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {teacher.teachingModules.map((tm) => (
                    <Badge key={tm.id} variant="secondary">
                      {tm.module.code}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className="bg-main text-white"
                  variant={teacher.isActive ? "default" : "secondary"}
                >
                  {teacher.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog
                  open={isAddCohortOpen && selectedTeacherId === teacher.id}
                  onOpenChange={(open) => {
                    setIsAddCohortOpen(open);
                    if (!open) setSelectedTeacherId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTeacherId(teacher.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Cohort
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Cohort</DialogTitle>
                      <DialogDescription>
                        Create a new class group for {department.name} taught by{" "}
                        {teacher.user.name}
                      </DialogDescription>
                    </DialogHeader>
                    <AddCohortForm
                      departmentId={department.id}
                      departmentName={department.name}
                      teacherId={teacher.id}
                      teacherName={teacher.user.name}
                      onSuccess={handleAddCohortSuccess}
                      onCancel={() => {
                        setIsAddCohortOpen(false);
                        setSelectedTeacherId(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffTab;
