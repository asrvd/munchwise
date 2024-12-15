import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./PersonalInfoForm";

interface NutritionGoalsFormProps {
  form: UseFormReturn<SettingsFormValues>;
}

export const NutritionGoalsForm = ({ form }: NutritionGoalsFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Nutrition Goals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="calorieGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Calories</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Target calories per day</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proteinGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Protein (g)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Daily protein target</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carbsGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carbs (g)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Daily carbs target</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fatGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fat (g)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Daily fat target</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};