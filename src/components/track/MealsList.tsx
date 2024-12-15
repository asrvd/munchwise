import { MealCard } from "./MealCard";
import { Plus } from "lucide-react";

interface MealsListProps {
  meals: any[];
  onDelete: () => void;
}

export const MealsList = ({ meals, onDelete }: MealsListProps) => {
  if (!meals?.length) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">No meals logged yet</h3>
        <p className="text-muted-foreground mt-2">
          Start tracking your meals by adding your first entry above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meals.map((meal, index) => (
        <MealCard
          key={meal.id}
          meal={meal}
          index={index}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};