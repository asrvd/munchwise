import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, addDays } from "date-fns";
import { CircularProgress } from "@/components/track/CircularProgress";
import { WeeklyCaloriesChart } from "@/components/analytics/WeeklyCaloriesChart";
import { NutritionStats } from "@/components/analytics/NutritionStats";
import { WeeklySummary } from "@/components/analytics/WeeklySummary";

const Analytics = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: foodEntries } = useQuery({
    queryKey: ['food_entries', session?.user?.id],
    queryFn: async () => {
      const startDate = startOfWeek(new Date());
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Process data for the weekly chart
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date()), i);
    const dayEntries = foodEntries?.filter(entry => 
      format(new Date(entry.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) || [];
    
    return {
      day: format(date, 'EEE'),
      calories: dayEntries.reduce((sum, entry) => sum + entry.calories, 0),
      goal: profile?.daily_calories || 2000,
    };
  });

  // Calculate nutrition averages
  const calculateAverage = (nutrient: 'protein' | 'carbs' | 'fat') => {
    if (!foodEntries?.length) return 0;
    const total = foodEntries.reduce((sum, entry) => sum + (entry[nutrient] || 0), 0);
    return Math.round(total / foodEntries.length);
  };

  const nutritionData = {
    proteins: calculateAverage('protein'),
    carbs: calculateAverage('carbs'),
    fats: calculateAverage('fat'),
  };

  // Calculate weekly summary
  const averageDailyCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0) / 7;
  const daysOnTarget = weeklyData.filter(day => 
    Math.abs(day.calories - (profile?.daily_calories || 2000)) <= 200
  ).length;
  const bestDay = weeklyData.reduce((best, current) => 
    Math.abs(current.calories - (profile?.daily_calories || 2000)) < 
    Math.abs(best.calories - (profile?.daily_calories || 2000)) ? current : best
  ).day;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View insights and trends from your nutrition journey
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <CircularProgress
          value={nutritionData.proteins}
          max={profile?.protein_goal || 150}
          label="Protein"
        />
        <CircularProgress
          value={nutritionData.carbs}
          max={profile?.carbs_goal || 250}
          label="Carbs"
        />
        <CircularProgress
          value={nutritionData.fats}
          max={profile?.fat_goal || 70}
          label="Fat"
        />
        <CircularProgress
          value={averageDailyCalories}
          max={profile?.daily_calories || 2000}
          label="Calories"
        />
      </div>

      <WeeklyCaloriesChart weeklyData={weeklyData} />
      <NutritionStats nutritionData={nutritionData} />
      <WeeklySummary
        averageDailyCalories={averageDailyCalories}
        daysOnTarget={daysOnTarget}
        bestDay={bestDay}
      />
    </div>
  );
};

export default Analytics;