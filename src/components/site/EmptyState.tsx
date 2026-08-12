import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center">
      {icon ? <div className="text-accent">{icon}</div> : null}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
