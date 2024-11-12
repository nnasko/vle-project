// components/ModuleCard.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookText, ClipboardCheck } from "lucide-react";

interface ModuleCardProps {
  module: {
    id: string;
    code: string;
    name: string;
    description: string;
    year: number;
    credits: number;
    status: "active" | "review" | "archived";
    passingRate: number;
    averageScore: number;
  };
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">
              {module.code}: {module.name}
            </CardTitle>
            <CardDescription>
              Year {module.year} • {module.credits} Credits
            </CardDescription>
          </div>
          <Badge
            variant={module.status === "active" ? "default" : "secondary"}
            className="bg-main text-white"
          >
            {module.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <BookText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Passing Rate: {module.passingRate}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Average Score: {module.averageScore}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
