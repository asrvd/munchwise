import { Skeleton } from "@/components/ui/skeleton";

export const LoadingScreen = () => {
  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 space-y-6">
          <Skeleton className="h-6 w-[200px]" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
            </div>
            <Skeleton className="h-px" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};