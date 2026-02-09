import { Phone, Headphones, UserRound, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LiveCallItemProps {
  callerNumber: string;
  duration: string;
  intent: string;
  confidence: number;
  status: "active" | "on-hold" | "transferring";
  startTimeUnix?: number; // Add this for live duration counter
}

export function LiveCallItem({
  callerNumber,
  duration,
  intent,
  confidence,
  status,
  startTimeUnix,
}: LiveCallItemProps) {
  // Live duration counter that updates every second
  const [liveDuration, setLiveDuration] = useState(duration);

  useEffect(() => {
    if (!startTimeUnix) {
      setLiveDuration(duration);
      return;
    }

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - startTimeUnix;
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setLiveDuration(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimeUnix, duration]);
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "text-success";
    if (conf >= 60) return "text-warning";
    return "text-destructive";
  };

  const statusConfig = {
    active: {
      bg: "bg-success/10",
      border: "border-success/20",
      dot: "bg-success",
    },
    "on-hold": {
      bg: "bg-warning/10",
      border: "border-warning/20",
      dot: "bg-warning",
    },
    transferring: {
      bg: "bg-info/10",
      border: "border-info/20",
      dot: "bg-info",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-sm",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center border border-border">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card animate-pulse-soft",
              config.dot
            )}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-card-foreground tracking-tight">
            {callerNumber}
          </p>
          <p className="text-xs text-muted-foreground tracking-tight font-mono">{liveDuration}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-medium text-card-foreground tracking-tight">{intent}</p>
          <p className={cn("text-xs font-medium tracking-tight", getConfidenceColor(confidence))}>
            {confidence}% confidence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Headphones className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <UserRound className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
