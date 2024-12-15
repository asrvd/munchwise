import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { calculateNutritionGoals } from "@/lib/calculate-goals";
import { OnboardingMetricsForm } from "@/components/onboarding/OnboardingMetricsForm";
import { NutritionGoalsForm } from "@/components/onboarding/NutritionGoalsForm";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    goal: "maintain",
    calorieGoal: "",
    proteinGoal: "",
    carbsGoal: "",
    fatGoal: ""
  });

  const calculateGoals = async () => {
    setIsCalculating(true);
    try {
      const goals = await calculateNutritionGoals({
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        goal: formData.goal as 'lose' | 'maintain' | 'gain'
      });
      
      setFormData(prev => ({
        ...prev,
        calorieGoal: goals.dailyCalories.toString(),
        proteinGoal: goals.protein.toString(),
        carbsGoal: goals.carbs.toString(),
        fatGoal: goals.fat.toString()
      }));

      toast({
        title: "Goals Calculated",
        description: "Your nutrition goals have been calculated based on your metrics.",
      });
      
      setStep(2);
    } catch (error) {
      console.error('Error calculating goals:', error);
      toast({
        title: "Error",
        description: "Failed to calculate nutrition goals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          goal: formData.goal,
          daily_calories: parseInt(formData.calorieGoal),
          protein_goal: parseInt(formData.proteinGoal),
          carbs_goal: parseInt(formData.carbsGoal),
          fat_goal: parseInt(formData.fatGoal)
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Profile Created!",
        description: "Your nutrition goals have been set. Let's start tracking!",
      });
      
      navigate("/track");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-2xl px-4 py-8 animate-fade-in">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Aboard</h1>
          <p className="text-muted-foreground">
            Let's personalize your nutrition journey
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 1 ? "Tell us about yourself" : "Your Personalized Goals"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <OnboardingMetricsForm
                formData={formData}
                setFormData={setFormData}
                onCalculate={calculateGoals}
                isCalculating={isCalculating}
              />
            ) : (
              <NutritionGoalsForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;