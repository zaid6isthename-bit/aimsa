import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="admin-card flex flex-col items-center justify-center py-16 px-6 text-center border-dashed border-[#B5AFA3]/40">
      <div className="mb-4 rounded-full bg-[#121110]/5 p-4">
        <Inbox size={32} className="text-[#B5AFA3]" />
      </div>
      <h3 className="font-syne text-lg font-bold text-[#121110]">{title}</h3>
      <p className="font-mono-tech mt-1 max-w-sm text-sm text-[#B5AFA3]">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
