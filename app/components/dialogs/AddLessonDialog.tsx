import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Check, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Teacher, NewLessonRequest } from "@/types/department";

interface AddLessonDialogProps {
  onAddLesson: (lesson: NewLessonRequest) => Promise<void>;
  teachers: Teacher[];
  defaultTeacherId?: string;
  isLoading?: boolean;
  studentCohortId: string; // rename to be more specific
}

const AddLessonDialog: React.FC<AddLessonDialogProps> = ({
  onAddLesson,
  teachers = [],
  defaultTeacherId,
  isLoading = false,
  studentCohortId, // Use renamed prop
}) => {
  const [open, setOpen] = useState(false);
  const [openTeacherSelect, setOpenTeacherSelect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this
  const [error, setError] = useState<string | null>(null); // Add this
  const [newLesson, setNewLesson] = useState<NewLessonRequest>(() => ({
    moduleId: "",
    cohortId: studentCohortId, // Initialize with the student's cohort ID
    topic: "",
    description: "",
    teacherId: defaultTeacherId || "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    materials: [],
  }));

  const handleSubmit = async () => {
    if (!studentCohortId) {
      setError("No cohort assigned to student");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Always use the student's cohort ID
      const lessonData = {
        ...newLesson,
        cohortId: studentCohortId,
      };

      console.log("Submitting lesson with data:", lessonData); // Debug log
      await onAddLesson(lessonData);

      setNewLesson({
        moduleId: "",
        cohortId: studentCohortId,
        topic: "",
        description: "",
        teacherId: defaultTeacherId || "",
        date: "",
        startTime: "",
        endTime: "",
        room: "",
        materials: [],
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to add lesson:", error);
      setError(error instanceof Error ? error.message : "Failed to add lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTeacher = teachers.find((t) => t.id === newLesson.teacherId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main hover:bg-second text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Lesson</DialogTitle>
          {error && ( // Add error display
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-white">Topic</Label>
            <Input
              value={newLesson.topic}
              onChange={(e) =>
                setNewLesson({ ...newLesson, topic: e.target.value })
              }
              className="bg-neutral-700 border-neutral-600 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-white">Description</Label>
            <Input
              value={newLesson.description}
              onChange={(e) =>
                setNewLesson({ ...newLesson, description: e.target.value })
              }
              className="bg-neutral-700 border-neutral-600 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-white">Teacher</Label>
            <Popover
              open={openTeacherSelect}
              onOpenChange={setOpenTeacherSelect}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between bg-neutral-700 border-neutral-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading teachers...
                    </div>
                  ) : selectedTeacher ? (
                    `${selectedTeacher.user.name} (${selectedTeacher.department.name})`
                  ) : (
                    "Select teacher..."
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-neutral-700">
                <Command>
                  <CommandInput
                    placeholder="Search teachers..."
                    className="text-black"
                  />
                  <CommandList>
                    <CommandEmpty>No teachers found.</CommandEmpty>
                    <CommandGroup>
                      {teachers.map((teacher) => (
                        <CommandItem
                          key={teacher.id}
                          onSelect={() => {
                            setNewLesson({
                              ...newLesson,
                              teacherId: teacher.id,
                            });
                            setOpenTeacherSelect(false);
                          }}
                          className="text-black hover:text-main"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <span>{teacher.user.name}</span>
                              <span className="ml-2 text-sm text-gray-400">
                                ({teacher.department.name})
                              </span>
                            </div>
                            {newLesson.teacherId === teacher.id && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label className="text-white">Room</Label>
            <Input
              value={newLesson.room}
              onChange={(e) =>
                setNewLesson({ ...newLesson, room: e.target.value })
              }
              className="bg-neutral-700 border-neutral-600 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-white">Date</Label>
            <Input
              type="date"
              value={newLesson.date}
              onChange={(e) =>
                setNewLesson({ ...newLesson, date: e.target.value })
              }
              className="bg-neutral-700 border-neutral-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-white">Start Time</Label>
              <Input
                type="time"
                value={newLesson.startTime}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, startTime: e.target.value })
                }
                className="bg-neutral-700 border-neutral-600 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white">End Time</Label>
              <Input
                type="time"
                value={newLesson.endTime}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, endTime: e.target.value })
                }
                className="bg-neutral-700 border-neutral-600 text-white"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-main hover:bg-second text-white"
            disabled={
              !newLesson.teacherId ||
              !newLesson.topic ||
              !newLesson.room ||
              isLoading
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Add Lesson"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonDialog;
