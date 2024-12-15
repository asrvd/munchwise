import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { foodDescription } = await req.json();

    if (!foodDescription) {
      return new Response(
        JSON.stringify({ error: 'Food description is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const prompt = `Analyze this food and return a JSON object with these nutritional values (use your best estimate):
    {
      "calories": number (required),
      "protein": number in grams (optional),
      "carbs": number in grams (optional),
      "fat": number in grams (optional),
      "emoji": single emoji representing the food (optional)
    }
    
    Food to analyze: ${foodDescription}`;

    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('TOGETHER_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 100,
        stop: ['}'],
      }),
    });

    if (!response.ok) {
      throw new Error(`Together API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Together API response:', data);
    
    // Extract the JSON object from the response
    const nutritionMatch = data.output.choices[0].text.trim().match(/\{[\s\S]*\}/);
    if (!nutritionMatch) {
      throw new Error('Could not parse nutrition data from response');
    }

    let nutritionData;
    try {
      nutritionData = JSON.parse(nutritionMatch[0]);
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid nutrition data format');
    }

    // Validate required fields
    if (typeof nutritionData.calories !== 'number') {
      throw new Error('Invalid calories value in response');
    }

    return new Response(
      JSON.stringify(nutritionData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-food function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze food entry' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});