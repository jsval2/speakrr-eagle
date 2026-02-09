import { Sidebar } from "./Sidebar";
import { LiveCallsIndicator } from "./LiveCallsIndicator";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("sidebar-collapsed");
      setIsCollapsed(stored ? JSON.parse(stored) : false);
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for changes since localStorage events don't fire in the same tab
    const interval = setInterval(() => {
      handleStorageChange();
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300",
        isCollapsed ? "pl-16" : "pl-64"
      )}>
        <div className="p-8">{children}</div>
      </main>
      <LiveCallsIndicator />
    </div>
  );
}
