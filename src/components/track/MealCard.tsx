import { Card, CardContent } from "@/components/ui/card";
import { Timer, Utensils, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MealCardProps {
  meal: {
    id: string;
    food_description: string;
    meal_time: string;
    calories: number;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    emoji: string | null;
  };
  onDelete: () => void;
}

export const MealCard = ({ meal, onDelete }: MealCardProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    const { error } = await supabase
      .from('food_entries')
      .delete()
      .eq('id', meal.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete meal. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meal Deleted",
      description: `Deleted: ${meal.food_description}`,
    });
    onDelete();
  };

  return (
    <Card className="card-hover">
      <CardContent className="flex items-center p-4">
        <div className="text-4xl mr-4">{meal.emoji || '🍽️'}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            <h3 className="font-medium">{meal.food_description}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Timer className="h-4 w-4" />
            <span>
              {new Date(meal.meal_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{meal.calories} cal</p>
            <p className="text-sm text-muted-foreground">
              P: {meal.protein || 0}g • C: {meal.carbs || 0}g • F: {meal.fat || 0}g
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};