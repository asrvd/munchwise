interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  label: string;
}

export const CircularProgress = ({ value, max, size = 120, label }: CircularProgressProps) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-1000 ease-in-out"
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute flex flex-col items-center animate-fade-in">
        <span className="text-xl font-bold">{Math.round(percentage)}%</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};