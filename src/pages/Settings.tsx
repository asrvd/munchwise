import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PersonalInfoForm } from "@/components/settings/PersonalInfoForm";
import { NutritionGoalsForm } from "@/components/settings/NutritionGoalsForm";
import type { SettingsFormValues } from "@/components/settings/PersonalInfoForm";

const formSchema = z.object({
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  calorieGoal: z.string().min(1, "Calorie goal is required"),
  proteinGoal: z.string().min(1, "Protein goal is required"),
  carbsGoal: z.string().min(1, "Carbs goal is required"),
  fatGoal: z.string().min(1, "Fat goal is required"),
});

const Settings = () => {
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: "",
      weight: "",
      calorieGoal: "",
      proteinGoal: "",
      carbsGoal: "",
      fatGoal: "",
    },
    values: profile ? {
      height: profile.height?.toString() || "",
      weight: profile.weight?.toString() || "",
      calorieGoal: profile.daily_calories?.toString() || "",
      proteinGoal: profile.protein_goal?.toString() || "",
      carbsGoal: profile.carbs_goal?.toString() || "",
      fatGoal: profile.fat_goal?.toString() || "",
    } : undefined,
  });

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          height: parseFloat(values.height),
          weight: parseFloat(values.weight),
          daily_calories: parseInt(values.calorieGoal),
          protein_goal: parseInt(values.proteinGoal),
          carbs_goal: parseInt(values.carbsGoal),
          fat_goal: parseInt(values.fatGoal),
        })
        .eq('id', session?.user?.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update settings. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoForm form={form} />
              <Separator />
              <NutritionGoalsForm form={form} />
              <Button type="submit" className="w-full sm:w-auto">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;