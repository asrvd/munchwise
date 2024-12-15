import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { foodDescription } = await req.json();
    
    if (!foodDescription) {
      throw new Error('Food description is required');
    }

    console.log('Analyzing food:', foodDescription);

    const prompt = `<system>You are a helpful nutrition assistant that analyzes food descriptions and returns nutritional information in JSON format.</system>
<user>Analyze this food and return a JSON object with these nutritional values (use your best estimate):
{
  "calories": number (required),
  "protein": number in grams (optional),
  "carbs": number in grams (optional),
  "fat": number in grams (optional),
  "emoji": single emoji representing the food (optional)
}

Food to analyze: ${foodDescription}</user>
<assistant>`;

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
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        max_tokens: 100,
        response_format: { "type": "json_object" },
      }),
    });

    if (!response.ok) {
      console.error('Together API error:', await response.text());
      throw new Error('Failed to analyze food with Together API');
    }

    const data = await response.json();
    console.log('Together API response:', data);

    const nutritionText = data.output.choices[0].text;
    console.log('Nutrition text:', nutritionText);

    const nutritionData = JSON.parse(nutritionText);
    console.log('Parsed nutrition data:', nutritionData);

    if (typeof nutritionData.calories !== 'number') {
      throw new Error('Invalid calories value in response');
    }

    return new Response(JSON.stringify(nutritionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-food function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze food entry' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});