import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeFoodEntry } from "@/lib/analyze-food";
import { Textarea } from "@/components/ui/textarea";

export const AddMealForm = ({ onMealAdded }: { onMealAdded: () => void }) => {
  const { toast } = useToast();
  const [mealInput, setMealInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be signed in to add meals",
          variant: "destructive",
        });
        return;
      }

      const analysis = await analyzeFoodEntry(mealInput);

      const { error } = await supabase.from("food_entries").insert([
        {
          user_id: user.id,
          food_description: mealInput,
          calories: analysis.calories,
          protein: analysis.protein,
          carbs: analysis.carbs,
          fat: analysis.fat,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Meal Added",
        description: `Added: ${mealInput}`,
      });
      setMealInput("");
      onMealAdded();
    } catch (error) {
      console.error("Error adding meal:", error);
      toast({
        title: "Error",
        description: "Failed to add meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleAddMeal} className="flex flex-col gap-2">
      <Textarea
        placeholder="Describe your meal (e.g., 1 bowl rice, 100g chicken, 50g broccoli)"
        value={mealInput}
        onChange={(e) => setMealInput(e.target.value)}
        disabled={isAnalyzing}
        className="h-32"
      />
      <Button type="submit" disabled={isAnalyzing} className="lg:max-w-max">
        <PlusCircle className="h-4 w-4" />
        {isAnalyzing ? "Analyzing..." : "Add"}
      </Button>
    </form>
  );
};