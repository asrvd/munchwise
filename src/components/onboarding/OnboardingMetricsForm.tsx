import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MetricsFormProps {
  formData: {
    age: string;
    height: string;
    weight: string;
    goal: string;
  };
  setFormData: (data: any) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export const OnboardingMetricsForm = ({
  formData,
  setFormData,
  onCalculate,
  isCalculating,
}: MetricsFormProps) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onCalculate(); }}>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="Enter your age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
          className="input-focus"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="Enter your height in cm"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
          required
          className="input-focus"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="Enter your weight in kg"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          required
          className="input-focus"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goal">Weight Goal</Label>
        <Select
          value={formData.goal}
          onValueChange={(value) => setFormData({ ...formData, goal: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lose">Lose Weight</SelectItem>
            <SelectItem value="maintain">Maintain Weight</SelectItem>
            <SelectItem value="gain">Gain Weight</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isCalculating}>
        {isCalculating ? "Calculating..." : (
          <>
            Calculate Goals
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};