import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, BookOpen } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { AddModuleForm } from "./forms/AddModuleForm";
import { Department } from "@/types/department";

interface ModulesTabProps {
  department: Department;
}

const ModulesTab: React.FC<ModulesTabProps> = ({ department }) => {
  // State for filters and search
  const [moduleSearch, setModuleSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // State for dialogs
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get modules from department and provide fallback
  const allModules = department.modules || [];

  // Filter modules based on search and filters
  const filteredModules = allModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      module.code.toLowerCase().includes(moduleSearch.toLowerCase());
    const matchesYear =
      yearFilter === "all" || module.year.toString() === yearFilter;
    const matchesStatus =
      statusFilter === "all" || module.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesYear && matchesStatus;
  });

  // Handle successful module creation
  const handleModuleCreated = () => {
    setIsAddModuleOpen(false);
    toast.success("Module created successfully");
    // You would typically refresh the department data here
  };

  // Handle module deletion
  const handleDeleteModule = async (moduleId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/modules?id=${moduleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete module");
      }

      toast.success("Module deleted successfully");
      setDeleteModuleId(null);
      // You would typically refresh the department data here
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Failed to delete module");
    } finally {
      setIsDeleting(false);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "review":
        return "warning";
      case "archived":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Search modules..."
            value={moduleSearch}
            onChange={(e) => setModuleSearch(e.target.value)}
            className="w-[300px]"
          />
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {[1, 2, 3].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  Year {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Module Dialog */}
        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-main hover:bg-second">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new module for {department.name}. Fill in all required
                information below.
              </DialogDescription>
            </DialogHeader>
            <AddModuleForm
              departmentId={department.id}
              onSuccess={handleModuleCreated}
              onCancel={() => setIsAddModuleOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6">
        {filteredModules.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Modules Found</h3>
            <p>
              No modules match your current filters. Try adjusting your search
              criteria.
            </p>
          </Card>
        ) : (
          filteredModules.map((module) => (
            <Card key={module.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">
                      {module.code} - {module.name}
                    </h3>
                    <Badge
                      variant={getStatusVariant(module.status)}
                      className="capitalize"
                    >
                      {module.status.toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Year {module.year} • {module.credits} Credits
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteModuleId(module.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4">{module.description}</p>

              {/* Module Statistics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Pass Rate</p>
                  <p className="font-medium">
                    {module.passingRate ? `${module.passingRate}%` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Average Score</p>
                  <p className="font-medium">
                    {module.averageScore ? `${module.averageScore}%` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Topics</p>
                  <p className="font-medium">{module.topics?.length || 0}</p>
                </div>
              </div>

              {/* Module Details */}
              {module.learningOutcomes &&
                module.learningOutcomes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium mb-2">
                      Learning Outcomes
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {module.learningOutcomes.map((outcome, index) => (
                        <li key={outcome.id}>{outcome.description}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Teachers assigned to this module */}
              {module.teachers && module.teachers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium mb-2">Teaching Staff</h4>
                  <div className="flex flex-wrap gap-2">
                    {module.teachers.map((teacherModule) => (
                      <Badge key={teacherModule.id} variant="outline">
                        {teacherModule.teacher.user.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteModuleId}
        onOpenChange={(open) => !open && setDeleteModuleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              module and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteModuleId && handleDeleteModule(deleteModuleId)
              }
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Module"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModulesTab;
