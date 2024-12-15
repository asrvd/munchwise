import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklySummaryProps {
  averageDailyCalories: number;
  daysOnTarget: number;
  bestDay: string;
}

export const WeeklySummary = ({
  averageDailyCalories,
  daysOnTarget,
  bestDay,
}: WeeklySummaryProps) => {
  return (
    <Card className="bg-orange-50/60 border border-orange-200/50">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Average Daily Calories</span>
            <span className="font-medium">
              {Math.round(averageDailyCalories)} cal
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Days On Target</span>
            <span className="font-medium">{daysOnTarget}/7 days</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Best Day</span>
            <span className="font-medium">{bestDay}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};