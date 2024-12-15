import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target, Dumbbell, Scale } from "lucide-react";

interface NutritionGoalsFormProps {
  formData: {
    calorieGoal: string;
    proteinGoal: string;
    carbsGoal: string;
    fatGoal: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const NutritionGoalsForm = ({
  formData,
  setFormData,
  onSubmit,
  onBack,
}: NutritionGoalsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <Label htmlFor="calories">Daily Calorie Goal</Label>
          </div>
          <Input
            id="calories"
            type="number"
            value={formData.calorieGoal}
            onChange={(e) => setFormData({ ...formData, calorieGoal: e.target.value })}
            className="input-focus"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <Label htmlFor="protein">Daily Protein Goal (g)</Label>
          </div>
          <Input
            id="protein"
            type="number"
            value={formData.proteinGoal}
            onChange={(e) => setFormData({ ...formData, proteinGoal: e.target.value })}
            className="input-focus"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <Label htmlFor="carbs">Daily Carbs Goal (g)</Label>
          </div>
          <Input
            id="carbs"
            type="number"
            value={formData.carbsGoal}
            onChange={(e) => setFormData({ ...formData, carbsGoal: e.target.value })}
            className="input-focus"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <Label htmlFor="fat">Daily Fat Goal (g)</Label>
          </div>
          <Input
            id="fat"
            type="number"
            value={formData.fatGoal}
            onChange={(e) => setFormData({ ...formData, fatGoal: e.target.value })}
            className="input-focus"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={onBack}
        >
          Back
        </Button>
        <Button type="submit" className="w-full">
          Start Tracking
        </Button>
      </div>
    </form>
  );
};