// components/ModulesTab.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department } from "@/types/department";

interface ModulesTabProps {
  department: Department;
}

const ModulesTab: React.FC<ModulesTabProps> = ({ department }) => {
  const [moduleSearch, setModuleSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const allModules = department.courses.flatMap((course) => course.modules);

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

  return (
    <div className="space-y-6">
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
        <Button className="bg-main hover:bg-second">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">
                    {module.code} - {module.name}
                  </h3>
                  <Badge
                    variant={
                      module.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {module.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Year {module.year} • {module.credits} Credits
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{module.description}</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Pass Rate</p>
                <p className="font-medium">{module.passingRate}%</p>
              </div>
              <div>
                <p className="text-gray-500">Average Score</p>
                <p className="font-medium">{module.averageScore}%</p>
              </div>
              <div>
                <p className="text-gray-500">Topics</p>
                <p className="font-medium">{module.topics.length}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModulesTab;
