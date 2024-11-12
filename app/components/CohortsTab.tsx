// components/CohortsTab.tsx

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Department } from "@/types/department";
import { format } from "date-fns";

interface CohortsTabProps {
  department: Department;
}

const CohortsTab: React.FC<CohortsTabProps> = ({ department }) => {
  return (
    <div className="space-y-4">
      {department.cohorts.map((cohort) => (
        <Card key={cohort.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{cohort.name}</h3>
              <p className="text-sm text-gray-500">
                Teacher: {cohort.teacher.user.name}
              </p>
              <p className="text-sm text-gray-500">
                Students: {cohort.currentStudents} / {cohort.maxStudents}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {format(new Date(cohort.startDate), "MMM yyyy")} -{" "}
                {format(new Date(cohort.endDate), "MMM yyyy")}
              </p>
            </div>
            <Badge variant={cohort.isActive ? "default" : "secondary"}>
              {cohort.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </Card>
      ))}

      {department.cohorts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No cohorts found for this course.
        </div>
      )}
    </div>
  );
};

export default CohortsTab;
