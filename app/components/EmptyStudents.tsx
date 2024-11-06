import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function EmptyStudents() {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-8 border-2 border-dashed rounded-lg border-neutral-600">
      <div className="mb-4">
        <PlusCircle className="w-12 h-12 text-neutral-400" />
      </div>
      <h3 className="mb-2 text-xl font-medium text-neutral-300">
        No Students Yet
      </h3>
      <p className="mb-4 text-sm text-neutral-400 ">
        Get started by creating your first student record
      </p>
      <Button className="bg-main hover:bg-second">Create Student</Button>
    </div>
  );
}
