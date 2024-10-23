import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface DataPoint {
  name: string;
  attendance: number; // Attendance as percentage (0-100)
  grades: number; // Grades as score (0-10)
}

interface OverviewProps {
  data: DataPoint[];
}

export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis
          dataKey="name"
          stroke="#888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        {/* Attendance axis (left) */}
        <YAxis
          yAxisId="attendance"
          stroke="#473BF0"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
          orientation="left"
        />
        {/* Grades axis (right) */}
        <YAxis
          yAxisId="grades"
          stroke="#6665DD"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toFixed(1)}
          domain={[0, 10]}
          orientation="right"
        />
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
                        {payload[0].value}%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-neutral-400">
                        Grades
                      </span>
                      <span className="font-bold text-neutral-100">
                        {Number(payload[1].value).toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Line
          yAxisId="attendance"
          type="monotone"
          dataKey="attendance"
          name="Attendance %"
          strokeWidth={2}
          stroke="#473BF0"
          dot={{ stroke: "#473BF0", fill: "#473BF0" }}
        />
        <Line
          yAxisId="grades"
          type="monotone"
          dataKey="grades"
          name="Grade (0-10)"
          strokeWidth={2}
          stroke="#6665DD"
          dot={{ stroke: "#6665DD", fill: "#6665DD" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Overview;
