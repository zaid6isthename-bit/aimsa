import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  draft: 'badge-draft',
  published: 'badge-published',
  scheduled: 'badge-scheduled',
  archived: 'badge-archived',
  active: 'badge-active',
  inactive: 'badge-inactive',
  upcoming: 'badge-upcoming',
  ongoing: 'badge-ongoing',
  completed: 'badge-completed',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || 'badge-archived';

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-mono-tech text-xs font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}
