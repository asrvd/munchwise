import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Utensils, Timer, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Track = () => {
  const { toast } = useToast();
  const [mealInput, setMealInput] = useState("");

  // Fetch user profile for goals
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch today's meals
  const { data: meals, refetch: refetchMeals } = useQuery({
    queryKey: ['meals', 'today'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('meal_time', today.toISOString())
        .order('meal_time', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate totals
  const totals = meals?.reduce((acc, meal) => ({
    calories: (acc.calories || 0) + meal.calories,
    protein: (acc.protein || 0) + (meal.protein || 0),
    carbs: (acc.carbs || 0) + (meal.carbs || 0),
  }), { calories: 0, protein: 0, carbs: 0 });

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('food_entries')
      .insert([
        {
          user_id: user.id,
          food_description: mealInput,
          calories: 300, // This should be calculated using AI in a real implementation
          protein: 20,
          carbs: 30,
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add meal",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meal Added",
      description: `Added: ${mealInput}`,
    });
    setMealInput("");
    refetchMeals();
  };

  const CircularProgress = ({ value, max, size = 120, label }: { value: number; max: number; size?: number; label: string }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
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
          <span className="text-xl font-bold">{Math.round(percentage)}%</span>
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
            <CircularProgress 
              value={totals?.calories || 0} 
              max={profile?.daily_calories || 2000} 
              label="Calories" 
            />
            <CircularProgress 
              value={totals?.protein || 0} 
              max={profile?.protein_goal || 150} 
              label="Protein" 
            />
            <CircularProgress 
              value={totals?.carbs || 0} 
              max={profile?.carbs_goal || 250} 
              label="Carbs" 
            />
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
          {!meals?.length ? (
            <div className="text-center py-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No meals logged yet</h3>
              <p className="text-muted-foreground mt-2">
                Start tracking your meals by adding your first entry above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {meals.map((meal) => (
                <Card key={meal.id} className="card-hover">
                  <CardContent className="flex items-center p-4">
                    <div className="text-4xl mr-4">{meal.emoji || '🍽️'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{meal.food_description}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Timer className="h-4 w-4" />
                        <span>
                          {new Date(meal.meal_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{meal.calories} cal</p>
                      <p className="text-sm text-muted-foreground">
                        P: {meal.protein || 0}g • C: {meal.carbs || 0}g
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Track;