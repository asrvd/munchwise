import { supabase } from "@/integrations/supabase/client";

export interface NutritionGoals {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserMetrics {
  age: number;
  height: number;
  weight: number;
  goal: 'lose' | 'maintain' | 'gain';
}

export async function calculateNutritionGoals(metrics: UserMetrics): Promise<NutritionGoals> {
  const { data, error } = await supabase.functions.invoke('calculate-goals', {
    body: metrics
  });

  if (error) {
    console.error('Error calculating goals:', error);
    throw error;
  }

  return data as NutritionGoals;
}