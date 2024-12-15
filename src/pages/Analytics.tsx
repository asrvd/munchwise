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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, addDays } from "date-fns";

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
              <span className="font-medium">{Math.round(averageDailyCalories)} cal</span>
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
    </div>
  );
};

export default Analytics;