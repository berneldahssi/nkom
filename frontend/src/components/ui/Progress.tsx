import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
}

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantMap = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

function Progress({ value, max = 100, className, showLabel, size = "md", variant = "default" }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full overflow-hidden rounded-full bg-primary/10", sizeMap[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", variantMap[variant])}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className="mt-1 block text-right text-xs text-charcoal/60">{Math.round(pct)}%</span>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

function CircularProgress({ value, max = 100, size = 80, strokeWidth = 8, className, children }: CircularProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth} className="stroke-primary/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="stroke-primary transition-all duration-700 ease-out"
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

export { Progress, CircularProgress };
