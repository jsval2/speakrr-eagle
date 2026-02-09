import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react";

interface AIInsightProps {
  type?: "insight" | "recommendation" | "alert" | "trend";
  title: string;
  description: string;
  metric?: {
    value: string;
    change?: number;
    label?: string;
  };
  priority?: "high" | "medium" | "low";
  className?: string;
}

export function AIInsight({
  type = "insight",
  title,
  description,
  metric,
  priority = "medium",
  className,
}: AIInsightProps) {
  const typeConfig = {
    insight: {
      icon: Sparkles,
      iconColor: "text-primary",
      borderColor: "border-primary/20",
      bgColor: "bg-primary/5",
      label: "AI INSIGHT",
    },
    recommendation: {
      icon: Lightbulb,
      iconColor: "text-warning",
      borderColor: "border-warning/20",
      bgColor: "bg-warning/5",
      label: "RECOMMENDATION",
    },
    alert: {
      icon: AlertCircle,
      iconColor: "text-destructive",
      borderColor: "border-destructive/20",
      bgColor: "bg-destructive/5",
      label: "ATTENTION REQUIRED",
    },
    trend: {
      icon: TrendingUp,
      iconColor: "text-success",
      borderColor: "border-success/20",
      bgColor: "bg-success/5",
      label: "TREND DETECTED",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border transition-all duration-300 p-5",
        config.borderColor,
        config.bgColor,
        "hover:border-opacity-40",
        priority === "high" && "border-l-2",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2 border border-current/20", config.iconColor)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("font-mono text-[9px] uppercase tracking-widest", config.iconColor)}>
                {config.label}
              </span>
              {priority === "high" && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-destructive">
                  • HIGH PRIORITY
                </span>
              )}
            </div>
            <h4 className="font-semibold text-sm leading-tight tracking-tighter">
              {title}
            </h4>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed tracking-tighter">
            {description}
          </p>

          {/* Metric (optional) */}
          {metric && (
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-mono text-2xl font-bold tracking-tight">
                {metric.value}
              </span>
              {metric.change !== undefined && (
                <div className="flex items-center gap-1">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span
                    className={cn(
                      "font-mono text-xs font-medium",
                      metric.change > 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                </div>
              )}
              {metric.label && (
                <span className="text-xs text-text-muted uppercase tracking-wider">
                  {metric.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
