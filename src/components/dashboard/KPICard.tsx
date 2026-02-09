import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive";
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: KPICardProps) {
  const iconVariants = {
    default: "border border-primary text-primary",
    success: "border border-success text-success",
    warning: "border border-warning text-warning",
    destructive: "border border-destructive text-destructive",
  };

  return (
    <div className="bg-card p-5 border border-border hover:border-border-strong transition-colors duration-300 accent-line">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-wider font-medium text-text-muted">{title}</p>
          <div className="flex items-baseline gap-3">
            <p className="font-mono text-3xl font-bold tracking-tight text-card-foreground">
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "font-mono text-xs font-medium tracking-wide",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-text-secondary">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-3 bg-transparent", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
