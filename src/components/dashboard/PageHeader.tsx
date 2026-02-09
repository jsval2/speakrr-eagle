import { StatusIndicator } from "./StatusIndicator";

interface PageHeaderProps {
  title: string;
  description?: string;
  showStatus?: boolean;
  status?: "online" | "offline" | "busy" | "idle";
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  showStatus = false,
  status = "online",
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {title}
          </h1>
          {showStatus && <StatusIndicator status={status} />}
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground tracking-tight">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
