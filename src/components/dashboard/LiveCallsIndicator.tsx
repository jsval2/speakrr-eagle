import { Phone } from "lucide-react";
import { useActiveCalls } from "@/hooks/useConversations";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function LiveCallsIndicator() {
  const { count, isLoading } = useActiveCalls();
  const hasActiveCalls = count > 0;

  return (
    <Link
      to="/live-calls"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-3 px-4 py-3",
        "bg-black border border-border/50 shadow-lg",
        "hover:border-border transition-colors cursor-pointer",
        "min-w-[140px]"
      )}
    >
      {/* Pulsating indicator */}
      <div className="relative flex items-center justify-center">
        {hasActiveCalls && (
          <>
            {/* Outer pulse ring */}
            <span className="absolute h-4 w-4 rounded-full bg-success/30 animate-ping" />
            {/* Middle pulse ring */}
            <span className="absolute h-3 w-3 rounded-full bg-success/50 animate-pulse" />
          </>
        )}
        {/* Core dot */}
        <span
          className={cn(
            "relative h-2.5 w-2.5 rounded-full",
            hasActiveCalls ? "bg-success" : "bg-muted-foreground/50"
          )}
        />
      </div>

      {/* Content */}
      <div className="flex items-center gap-2">
        <Phone className={cn(
          "h-4 w-4",
          hasActiveCalls ? "text-success" : "text-muted-foreground"
        )} />
        <div>
          <p className={cn(
            "text-xs font-medium",
            hasActiveCalls ? "text-white" : "text-muted-foreground"
          )}>
            {isLoading ? "..." : count} Live Call{count !== 1 ? "s" : ""}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {hasActiveCalls ? "In progress" : "No active calls"}
          </p>
        </div>
      </div>
    </Link>
  );
}
