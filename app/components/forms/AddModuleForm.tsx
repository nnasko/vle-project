import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { X, Plus } from "lucide-react";

interface AddModuleFormProps {
  departmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddModuleForm: React.FC<AddModuleFormProps> = ({
  departmentId,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    year: "1",
    credits: "10",
    learningOutcomes: [""],
    topics: [""],
  });

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...formData.learningOutcomes];
    newOutcomes[index] = value;
    setFormData({ ...formData, learningOutcomes: newOutcomes });
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  const addOutcome = () => {
    setFormData({
      ...formData,
      learningOutcomes: [...formData.learningOutcomes, ""],
    });
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [...formData.topics, ""],
    });
  };

  const removeOutcome = (index: number) => {
    const newOutcomes = formData.learningOutcomes.filter((_, i) => i !== index);
    setFormData({ ...formData, learningOutcomes: newOutcomes });
  };

  const removeTopic = (index: number) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          credits: parseInt(formData.credits),
          departmentId,
          learningOutcomes: formData.learningOutcomes.filter(
            (outcome) => outcome.trim() !== ""
          ),
          topics: formData.topics.filter((topic) => topic.trim() !== ""),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create module");
      }

      toast.success("Module created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error creating module:", error);
      toast.error("Failed to create module");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Module Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Module Code</Label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Year</Label>
          <Select
            value={formData.year}
            onValueChange={(value) => setFormData({ ...formData, year: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Credits</Label>
          <Input
            type="number"
            min="0"
            max="120"
            value={formData.credits}
            onChange={(e) =>
              setFormData({ ...formData, credits: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Learning Outcomes</Label>
        {formData.learningOutcomes.map((outcome, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={outcome}
              onChange={(e) => handleOutcomeChange(index, e.target.value)}
              placeholder={`Learning outcome ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeOutcome(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOutcome}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Outcome
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Topics</Label>
        {formData.topics.map((topic, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={topic}
              onChange={(e) => handleTopicChange(index, e.target.value)}
              placeholder={`Topic ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeTopic(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTopic}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-main hover:bg-second"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Module"}
        </Button>
      </div>
    </form>
  );
};
