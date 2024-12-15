import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Dumbbell, Scale, Target } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    goal: "maintain",
    calorieGoal: "2000",
    proteinGoal: "150",
    carbsGoal: "250"
  });

  const calculateGoals = () => {
    // Simplified calculation for demo
    let baseCalories = 2000;
    if (formData.goal === "lose") baseCalories -= 500;
    if (formData.goal === "gain") baseCalories += 500;
    
    setFormData(prev => ({
      ...prev,
      calorieGoal: baseCalories.toString(),
      proteinGoal: Math.round(baseCalories * 0.3 / 4).toString(),
      carbsGoal: Math.round(baseCalories * 0.5 / 4).toString()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Created!",
      description: "Your nutrition goals have been set. Let's start tracking!",
    });
    navigate("/track");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      {step === 1 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Tell us about yourself</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); calculateGoals(); setStep(2); }}>
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
              <Button type="submit" className="w-full">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Customize Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
              </div>
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" className="w-full">
                  Start Tracking
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Onboarding;