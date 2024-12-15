import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const togetherApiKey = Deno.env.get("TOGETHER_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, height, weight, goal } = await req.json();

    if (!togetherApiKey) {
      throw new Error("Together API key not configured");
    }

    console.log("Calculating goals for:", { age, height, weight, goal });

    const response = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${togetherApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a nutrition and fitness expert. Calculate appropriate daily calorie and macronutrient goals based on user metrics. Always return valid JSON with numbers for dailyCalories, protein, carbs, and fat.",
            },
            {
              role: "user",
              content: `Calculate daily nutrition goals for someone with these metrics:
              Age: ${age} years
              Height: ${height} cm
              Weight: ${weight} kg
              Goal: ${goal}
              
              Return a JSON object with strictly the following format:
              {
                "dailyCalories": number,
                "protein": number,
                "carbs": number,
                "fat": number
              }
              
              Base the calculations on established nutrition principles and include a moderate activity level.`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Together AI response:", data);

    return new Response(data.choices[0].message.content, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in calculate-goals function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
