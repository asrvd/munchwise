import { supabase } from "@/integrations/supabase/client";

export interface FoodAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function analyzeFoodEntry(description: string): Promise<FoodAnalysis> {
  const { data, error } = await supabase.functions.invoke('analyze-food', {
    body: { foodDescription: description }
  });

  if (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }

  return data as FoodAnalysis;
}