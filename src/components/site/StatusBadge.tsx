import type { EventStatus } from "@/content/types";
import { cn } from "@/lib/utils";

const styles: Record<EventStatus, string> = {
  "Registration Open": "bg-success/12 text-success border-success/30",
  "Coming Soon": "bg-primary/12 text-primary border-primary/30",
  Ongoing: "bg-accent/15 text-accent border-accent/35",
  Completed: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-destructive/12 text-destructive border-destructive/30",
};

export function StatusBadge({ status, className }: { status: EventStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        styles[status],
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
