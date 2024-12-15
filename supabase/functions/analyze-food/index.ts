import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { foodDescription } = await req.json();

    if (!foodDescription) {
      throw new Error("Food description is required");
    }

    console.log("Analyzing food:", foodDescription);

    const response = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("TOGETHER_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful nutrition assistant that analyzes food descriptions and returns nutritional information in JSON format. You must return exactly one emoji that best represents the food.",
            },
            {
              role: "user",
            content: `Analyze this food and RETURN ONLY a JSON object with these nutritional values (use your best estimate) in exactly the following format, DONT ADD ANYTHING ELSE OTHER:
            {
              "calories": number (required),
              "protein": number in grams (required),
              "carbs": number in grams (required),
              "fat": number in grams (required),
              "emoji": string containing exactly one emoji character (required)
            }
            
            Food to analyze: ${foodDescription}`,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Together API error:", await response.text());
      throw new Error("Failed to analyze food with Together API");
    }

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
