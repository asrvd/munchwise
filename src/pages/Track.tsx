import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const Track = () => {
  const { toast } = useToast();
  const [mealInput, setMealInput] = useState("");
  const dailyGoal = 2000; // Hardcoded for now
  const consumedCalories = 1450; // Hardcoded for now

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded calorie calculation
    const estimatedCalories = 300;
    toast({
      title: "Meal Added",
      description: `Estimated calories: ${estimatedCalories}`,
    });
    setMealInput("");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{consumedCalories} cal</span>
              <span>{dailyGoal} cal goal</span>
            </div>
            <Progress value={(consumedCalories / dailyGoal) * 100} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{dailyGoal - consumedCalories}</p>
                <p className="text-sm text-muted-foreground">Calories Left</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Meals Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">72%</p>
                <p className="text-sm text-muted-foreground">Goal Progress</p>
              </CardContent>
            </Card>
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
              { time: "8:00 AM", meal: "Oatmeal with banana", calories: 350 },
              { time: "1:00 PM", meal: "Chicken sandwich", calories: 450 },
              { time: "4:00 PM", meal: "Greek yogurt", calories: 150 },
              { time: "7:00 PM", meal: "Rice and curry", calories: 500 },
            ].map((meal, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">{meal.meal}</p>
                  <p className="text-sm text-muted-foreground">{meal.time}</p>
                </div>
                <p className="font-medium">{meal.calories} cal</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Track;