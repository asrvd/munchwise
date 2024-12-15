import { supabase } from "@/integrations/supabase/client";

export const analyzeFoodEntry = async (foodDescription: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('analyze-food', {
    body: { foodDescription },
  });

  if (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from food analysis');
  }

  return data;
};