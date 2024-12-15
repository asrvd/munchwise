import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyCaloriesChartProps {
  weeklyData: {
    day: string;
    calories: number;
    goal: number;
  }[];
}

export const WeeklyCaloriesChart = ({ weeklyData }: WeeklyCaloriesChartProps) => {
  return (
    <Card className="bg-orange-50/60 border border-orange-200/50">
      <CardHeader>
        <CardTitle>Weekly Calorie Intake</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(255 255 255 / 0.6)",
                borderRadius: "8px",
                border: "rgb(254 215 170 / 0.5)",
                backdropFilter: "blur(10px)",
              }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#F97316"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="goal"
              stroke="#94a3b8"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};