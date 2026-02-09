import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Phone,
  PhoneOutgoing,
  History,
  Settings2,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Live Calls", href: "/live-calls", icon: Phone },
  { name: "Outbound Calls", href: "/outbound-calls", icon: PhoneOutgoing },
  { name: "Call History", href: "/call-history", icon: History },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "AI Configuration", href: "/ai-config", icon: Settings2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo + Toggle */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden transition-all duration-300 opacity-100">
              <img
                src="/speakrr icon blue copy.png"
                alt="Speakrr"
                className="h-6 w-auto"
              />
              <div className="h-5 w-px bg-border" />
              <img
                src="/client-logo.png"
                alt="Client"
                className="h-[2rem] w-auto"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full transition-all duration-300">
              <img
                src="/speakrr icon blue copy.png"
                alt="Speakrr"
                className="h-5 w-auto"
              />
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className={cn(
              "h-6 w-6 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors flex-shrink-0",
              isCollapsed && "absolute top-16 left-1/2 -translate-x-1/2"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "border border-transparent hover:border-border",
                  isActive && "bg-primary text-primary-foreground border-primary",
                  !isActive && "text-sidebar-foreground hover:bg-sidebar-accent",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className={cn(
                  "text-[11px] uppercase tracking-wide transition-all duration-300",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-3">
          {/* Business Info */}
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <div className="h-8 w-8 bg-sidebar-accent flex items-center justify-center border border-border">
              <span className="font-mono text-[10px] font-medium text-sidebar-accent-foreground uppercase">
                EC
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                  Eagle Creek Village Dental
                </p>
                <p className="text-[9px] text-text-muted uppercase tracking-wider truncate">
                  Business
                </p>
              </div>
            )}
          </div>

          {/* Valentis AI Labs Credit */}
          <a
            href="https://valentis.ai"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block p-2.5 -mx-3 transition-opacity hover:opacity-90 text-center",
              isCollapsed && "mx-0 px-1"
            )}
            style={{ backgroundColor: '#0000ff' }}
          >
            <p className={cn(
              "text-[11px] font-medium text-white",
              isCollapsed && "text-[8px] leading-tight"
            )}>
              {isCollapsed ? "Speakrr" : "Speakrr by Valentis AI Labs"}
            </p>
          </a>
        </div>
      </div>
    </aside>
  );
}
