import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Phone,
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
            <div className="flex items-center gap-2 overflow-hidden transition-all duration-300 opacity-100">
              <img
                src="/spkr-blue-trans.svg"
                alt="SPKRR"
                className="h-4 w-auto"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full transition-all duration-300">
              <svg className="h-4 w-4" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,15.19h8.58c-1.23-2.2-2.32-4.24-3.51-6.22-.53-.88-.57-1.57.01-2.46,1.14-1.74,2.08-3.6,3.23-5.33.31-.47,1.05-.92,1.6-.93,5.06-.07,10.12-.06,15.18-.02.47,0,1.15.19,1.36.52,1.41,2.24,2.72,4.53,4.2,7.03h-8.57c1.32,2.29,2.46,4.37,3.7,6.39.49.8.46,1.38-.03,2.15-1.11,1.76-2.14,3.57-3.12,5.4-.46.85-1,1.19-2.01,1.18-5-.07-10.01-.05-15.02-.1-.47,0-1.15-.17-1.36-.49-1.42-2.24-2.73-4.54-4.25-7.11ZM13.02,22.53c2.9-4.91,5.64-9.52,8.35-14.15.14-.24.22-.66.1-.87-1.23-2.26-2.5-4.5-3.84-6.88-.36.47-.58.7-.74.96-2.51,4.27-5.02,8.54-7.48,12.83-.19.34-.19.95-.01,1.3,1.1,2.18,2.28,4.32,3.62,6.81Z"
                  fill="currentColor"
                  className="text-primary"
                />
              </svg>
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
                VD
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                  Valentis Dental
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
              "block bg-primary p-2.5 -mx-3 transition-opacity hover:opacity-90 text-center",
              isCollapsed && "mx-0 px-1"
            )}
          >
            <p className={cn(
              "text-[11px] font-medium text-primary-foreground",
              isCollapsed && "text-[8px] leading-tight"
            )}>
              {isCollapsed ? "Valentis" : "A product by Valentis AI Labs"}
            </p>
          </a>
        </div>
      </div>
    </aside>
  );
}
