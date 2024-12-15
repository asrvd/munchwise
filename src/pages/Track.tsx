import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { analyzeFoodEntry } from "@/lib/analyze-food";
import { CircularProgress } from "@/components/track/CircularProgress";
import { MealCard } from "@/components/track/MealCard";

const Track = () => {
  const { toast } = useToast();
  const [mealInput, setMealInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const totals = meals?.reduce((acc, meal) => ({
    calories: (acc.calories || 0) + meal.calories,
    protein: (acc.protein || 0) + (meal.protein || 0),
    carbs: (acc.carbs || 0) + (meal.carbs || 0),
  }), { calories: 0, protein: 0, carbs: 0 });

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be signed in to add meals",
          variant: "destructive",
        });
        return;
      }

      // Analyze the food using the edge function
      const analysis = await analyzeFoodEntry(mealInput);

      const { error } = await supabase
        .from('food_entries')
        .insert([
          {
            user_id: user.id,
            food_description: mealInput,
            calories: analysis.calories,
            protein: analysis.protein,
            carbs: analysis.carbs,
            fat: analysis.fat,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Meal Added",
        description: `Added: ${mealInput}`,
      });
      setMealInput("");
      refetchMeals();
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({
        title: "Error",
        description: "Failed to add meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Track Meals</h1>
        <p className="text-muted-foreground">
          Log your meals and track your daily nutrition progress
        </p>
      </div>

      <Card className="bg-orange-100/40 border border-orange-200/50">
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

      <Card className="bg-orange-100/40 border border-orange-200/50">
        <CardHeader>
          <CardTitle>Add Meal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMeal} className="flex gap-2">
            <Input
              placeholder="Describe your meal (e.g., 1 bowl rice, 2 chapati)"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              disabled={isAnalyzing}
            />
            <Button type="submit" disabled={isAnalyzing}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Add"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-orange-100/40 border border-orange-200/50">
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
              {meals.map((meal, index) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  index={index}
                  onDelete={refetchMeals}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Track;
