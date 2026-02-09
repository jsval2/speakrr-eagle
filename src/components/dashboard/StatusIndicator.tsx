import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "busy" | "idle";
  label?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({
  status,
  label,
  showLabel = true,
  size = "md",
}: StatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: "bg-primary",
      label: label || "ONLINE",
    },
    offline: {
      color: "bg-text-muted",
      label: label || "OFFLINE",
    },
    busy: {
      color: "bg-warning",
      label: label || "BUSY",
    },
    idle: {
      color: "bg-text-secondary",
      label: label || "IDLE",
    },
  };

  const sizeConfig = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "animate-blink",
          config.color,
          sizeConfig[size]
        )}
      />
      {showLabel && (
        <span className="font-mono text-[10px] uppercase tracking-wider font-medium text-text-secondary">
          {config.label}
        </span>
      )}
    </div>
  );
}
