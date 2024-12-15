import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NutritionStatsProps {
  nutritionData: {
    proteins: number;
    carbs: number;
    fats: number;
  };
}

export const NutritionStats = ({ nutritionData }: NutritionStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-orange-50/60 border border-orange-200/50">
        <CardHeader>
          <CardTitle className="text-lg">Proteins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {nutritionData.proteins}g
          </div>
          <p className="text-sm text-muted-foreground">Daily Average</p>
        </CardContent>
      </Card>
      <Card className="bg-orange-50/60 border border-orange-200/50">
        <CardHeader>
          <CardTitle className="text-lg">Carbohydrates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {nutritionData.carbs}g
          </div>
          <p className="text-sm text-muted-foreground">Daily Average</p>
        </CardContent>
      </Card>
      <Card className="bg-orange-50/60 border border-orange-200/50">
        <CardHeader>
          <CardTitle className="text-lg">Fats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {nutritionData.fats}g
          </div>
          <p className="text-sm text-muted-foreground">Daily Average</p>
        </CardContent>
      </Card>
    </div>
  );
};