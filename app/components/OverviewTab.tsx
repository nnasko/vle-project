// components/OverviewTab.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Department } from "@/types/department";

interface OverviewTabProps {
  department: Department;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ department }) => {
  // Calculate trends data for the chart
  const enrollmentData = department.enrollmentTrends.map((trend) => ({
    month: new Date(trend.month).toLocaleDateString("en-US", {
      month: "short",
    }),
    students: trend.studentCount,
  }));

  return (
    <div className="space-y-6">
      {/* Enrollment Trends Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Enrollment Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#473BF0"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Course Performance Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Course Performance</h3>
        <div className="h-[300px]"></div>
      </Card>

      {/* Staff and Course Statistics */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Staff Distribution</h3>
          <div className="space-y-3">
            {Object.entries(
              department.teachers.reduce(
                (acc: Record<string, number>, teacher) => {
                  acc[teacher.position] = (acc[teacher.position] || 0) + 1;
                  return acc;
                },
                {}
              )
            ).map(([position, count]) => (
              <div key={position} className="flex justify-between items-center">
                <span className="text-gray-600">{position}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
