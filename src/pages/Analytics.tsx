import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  // Hardcoded data for demonstration
  const weeklyData = [
    { day: "Mon", calories: 1800, goal: 2000 },
    { day: "Tue", calories: 2100, goal: 2000 },
    { day: "Wed", calories: 1950, goal: 2000 },
    { day: "Thu", calories: 1700, goal: 2000 },
    { day: "Fri", calories: 2200, goal: 2000 },
    { day: "Sat", calories: 1900, goal: 2000 },
    { day: "Sun", calories: 1850, goal: 2000 },
  ];

  const nutritionData = {
    proteins: 72,
    carbs: 230,
    fats: 65,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Calorie Intake</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#F97316"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="goal"
                stroke="#94a3b8"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proteins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {nutritionData.proteins}g
            </div>
            <p className="text-sm text-muted-foreground">Daily Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Carbohydrates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {nutritionData.carbs}g
            </div>
            <p className="text-sm text-muted-foreground">Daily Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {nutritionData.fats}g
            </div>
            <p className="text-sm text-muted-foreground">Daily Average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Average Daily Calories</span>
              <span className="font-medium">1,928 cal</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Days On Target</span>
              <span className="font-medium">5/7 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Best Day</span>
              <span className="font-medium">Wednesday</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;