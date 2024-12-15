import { CircularProgress } from "./CircularProgress";

interface NutritionProgressProps {
  calories: number;
  caloriesGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fat: number;
  fatGoal: number;
}

export const NutritionProgress = ({
  calories,
  caloriesGoal,
  protein,
  proteinGoal,
  carbs,
  carbsGoal,
  fat,
  fatGoal,
}: NutritionProgressProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
      <CircularProgress
        value={calories}
        max={caloriesGoal}
        label="Calories"
      />
      <CircularProgress
        value={protein}
        max={proteinGoal}
        label="Protein"
      />
      <CircularProgress
        value={carbs}
        max={carbsGoal}
        label="Carbs"
      />
      <CircularProgress
        value={fat}
        max={fatGoal}
        label="Fat"
      />
    </div>
  );
};