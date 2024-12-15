import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, Utensils, Trash2, ChevronDown, ChevronUp } from "lucide-react";
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
  index: number;
  onDelete: () => void;
}

export const MealCard = ({ meal, index, onDelete }: MealCardProps) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

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
      description: `Deleted: Meal #${index + 1}`,
    });
    onDelete();
  };

  return (
    <Card className="card-hover bg-white/80 border border-orange-200/50">
      <CardContent className="flex items-center p-4">
        <div className="text-4xl mr-4">{meal.emoji || '🍽️'}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Meal #{index + 1}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-8 w-8 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
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
          {expanded && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{meal.food_description}</p>
            </div>
          )}
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