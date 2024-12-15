import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NutritionProgress } from "@/components/track/NutritionProgress";
import { AddMealForm } from "@/components/track/AddMealForm";
import { MealsList } from "@/components/track/MealsList";
import { Navigate } from "react-router-dom";

const Track = () => {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: meals, refetch: refetchMeals } = useQuery({
    queryKey: ["meals", "today"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("meal_time", today.toISOString())
        .order("meal_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const totals = meals?.reduce(
    (acc, meal) => ({
      calories: (acc.calories || 0) + meal.calories,
      protein: (acc.protein || 0) + (meal.protein || 0),
      carbs: (acc.carbs || 0) + (meal.carbs || 0),
      fat: (acc.fat || 0) + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (isProfileLoading) {
    return <div>Loading...</div>;
  }

  if (!profile?.daily_calories) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Track Meals</h1>
        <p className="text-muted-foreground">
          Log your meals and track your daily nutrition progress
        </p>
      </div>

      <Card className="bg-orange-50/60 border border-orange-200/50">
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <NutritionProgress
            calories={totals?.calories || 0}
            caloriesGoal={profile?.daily_calories || 2000}
            protein={totals?.protein || 0}
            proteinGoal={profile?.protein_goal || 150}
            carbs={totals?.carbs || 0}
            carbsGoal={profile?.carbs_goal || 250}
            fat={totals?.fat || 0}
            fatGoal={profile?.fat_goal || 70}
          />
        </CardContent>
      </Card>

      <Card className="bg-orange-50/60 border border-orange-200/50">
        <CardHeader>
          <CardTitle>Add Meal</CardTitle>
        </CardHeader>
        <CardContent>
          <AddMealForm onMealAdded={refetchMeals} />
        </CardContent>
      </Card>

      <Card className="bg-orange-50/60 border border-orange-200/50">
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <MealsList meals={meals} onDelete={refetchMeals} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Track;