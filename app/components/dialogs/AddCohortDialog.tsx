import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddCohortForm } from "../forms/AddCohortForm";

// components/dialogs/AddCohortDialog.tsx
interface AddCohortDialogProps {
  departmentId: string;
  courses: { id: string; name: string }[];
  teachers: { id: string; name: string }[];
  onCohortAdded: () => void;
}

export function AddCohortDialog({
  departmentId,
  courses,
  teachers,
  onCohortAdded,
}: AddCohortDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-main hover:bg-second">
          <Plus className="w-4 h-4 mr-2" />
          Add Cohort
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Cohort</DialogTitle>
          <DialogDescription>
            Create a new cohort for a course and assign a teacher.
          </DialogDescription>
        </DialogHeader>
        <AddCohortForm
          departmentId={departmentId}
          courses={courses}
          teachers={teachers}
          onSuccess={onCohortAdded}
        />
      </DialogContent>
    </Dialog>
  );
}
