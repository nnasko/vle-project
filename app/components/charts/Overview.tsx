"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface DataPoint {
  name: string;
  attendance: number;
  grades: number;
}

interface OverviewProps {
  data: DataPoint[];
}

export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-neutral-700 p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-neutral-400">
                        Attendance
                      </span>
                      <span className="font-bold text-neutral-100">
                        {payload[0].value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-neutral-400">
                        Grades
                      </span>
                      <span className="font-bold text-neutral-100">
                        {payload[1].value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="attendance"
          strokeWidth={2}
          stroke="#473BF0"
          style={{ opacity: 0.5 }}
        />
        <Line
          type="monotone"
          dataKey="grades"
          strokeWidth={2}
          stroke="#6665DD"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
