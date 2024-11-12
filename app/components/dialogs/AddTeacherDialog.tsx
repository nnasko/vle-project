// components/dialogs/AddTeacherDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddTeacherForm } from "../forms/AddTeacherForm";

interface AddTeacherDialogProps {
  departmentId: string;
  onTeacherAdded: () => void;
}

export function AddTeacherDialog({
  departmentId,
  onTeacherAdded,
}: AddTeacherDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-main hover:bg-second">
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Add a new teacher to the department. They will receive an email to
            set up their account.
          </DialogDescription>
        </DialogHeader>
        <AddTeacherForm
          departmentId={departmentId}
          onSuccess={onTeacherAdded}
        />
      </DialogContent>
    </Dialog>
  );
}
