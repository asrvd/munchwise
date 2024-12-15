import { supabase } from "@/integrations/supabase/client";

export const analyzeFoodEntry = async (foodDescription: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const response = await fetch('/analyze-food', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.id}`,
    },
    body: JSON.stringify({ foodDescription }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze food entry');
  }

  const data = await response.json();
  return data;
};