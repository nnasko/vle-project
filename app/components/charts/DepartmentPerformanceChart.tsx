import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DepartmentMetrics {
  name: string;
  studentCount: number;
  retentionRate: number;
  firstClassRate: number;
  graduationRate: number;
  employmentRate: number;
  target: number;
}

const DepartmentPerformanceChart = () => {
  // Sample data with UK-specific academic KPIs
  const data: DepartmentMetrics[] = [
    {
      name: "Computing",
      studentCount: 350,
      retentionRate: 92,
      firstClassRate: 28,
      graduationRate: 94,
      employmentRate: 95,
      target: 90,
    },
    {
      name: "Engineering",
      studentCount: 280,
      retentionRate: 88,
      firstClassRate: 25,
      graduationRate: 92,
      employmentRate: 92,
      target: 90,
    },
    {
      name: "Business",
      studentCount: 420,
      retentionRate: 85,
      firstClassRate: 22,
      graduationRate: 91,
      employmentRate: 88,
      target: 90,
    },
    {
      name: "Science",
      studentCount: 195,
      retentionRate: 90,
      firstClassRate: 30,
      graduationRate: 93,
      employmentRate: 87,
      target: 90,
    },
  ];

  const tooltipFormatter = (value: number, name: string) => {
    switch (name) {
      case "retentionRate":
        return [`${value}%`, "Retention Rate"];
      case "firstClassRate":
        return [`${value}%`, "First Class Honours"];
      case "graduationRate":
        return [`${value}%`, "Graduation Rate"];
      case "employmentRate":
        return [`${value}%`, "Graduate Employment"];
      default:
        return [value, name];
    }
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <ReferenceLine
            y={90}
            label={{
              value: "Russell Group Average",
              position: "right",
              fill: "#ff4444",
              fontSize: 12,
            }}
            stroke="#ff4444"
            strokeDasharray="3 3"
          />
          <Bar
            dataKey="retentionRate"
            name="Retention Rate"
            fill="#473BF0"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="firstClassRate"
            name="First Class Honours"
            fill="#6665DD"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="graduationRate"
            name="Graduation Rate"
            fill="#8B87FF"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="employmentRate"
            name="Graduate Employment"
            fill="#9F9DFF"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentPerformanceChart;
