import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Utensils, Timer } from "lucide-react";

const Track = () => {
  const { toast } = useToast();
  const [mealInput, setMealInput] = useState("");
  const dailyGoal = 2000;
  const consumedCalories = 1450;
  const proteinGoal = 150;
  const consumedProtein = 90;
  const carbsGoal = 250;
  const consumedCarbs = 180;

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const estimatedCalories = 300;
    toast({
      title: "Meal Added",
      description: `Estimated calories: ${estimatedCalories}`,
    });
    setMealInput("");
  };

  const CircularProgress = ({ value, max, size = 120, label }: { value: number; max: number; size?: number; label: string }) => {
    const percentage = (value / max) * 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex flex-col items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold">{Math.round((value / max) * 100)}%</span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Track Meals</h1>
        <p className="text-muted-foreground">
          Log your meals and track your daily nutrition progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around items-center py-4">
            <CircularProgress value={consumedCalories} max={dailyGoal} label="Calories" />
            <CircularProgress value={consumedProtein} max={proteinGoal} label="Protein" />
            <CircularProgress value={consumedCarbs} max={carbsGoal} label="Carbs" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Meal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMeal} className="flex gap-2">
            <Input
              placeholder="Describe your meal (e.g., 1 bowl rice, 2 chapati)"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
            />
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "8:00 AM", meal: "Oatmeal with banana", calories: 350, protein: 12, carbs: 45, emoji: "🥣" },
              { time: "1:00 PM", meal: "Chicken sandwich", calories: 450, protein: 28, carbs: 35, emoji: "🥪" },
              { time: "4:00 PM", meal: "Greek yogurt", calories: 150, protein: 15, carbs: 8, emoji: "🍶" },
              { time: "7:00 PM", meal: "Rice and curry", calories: 500, protein: 22, carbs: 65, emoji: "🍛" },
            ].map((meal, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="flex items-center p-4">
                  <div className="text-4xl mr-4">{meal.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">{meal.meal}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Timer className="h-4 w-4" />
                      <span>{meal.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{meal.calories} cal</p>
                    <p className="text-sm text-muted-foreground">
                      P: {meal.protein}g • C: {meal.carbs}g
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Track;
