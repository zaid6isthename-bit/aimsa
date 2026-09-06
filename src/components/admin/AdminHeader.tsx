'use client';

import { LogOut, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
  user: { name: string; role: string };
}

export default function AdminHeader({ title, user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const roleBadgeColor =
    user.role === 'super_admin'
      ? 'bg-[#D92525]/10 text-[#D92525]'
      : 'bg-[#121110]/10 text-[#121110]';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#B5AFA3]/30 bg-[#FAF8F5]/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <h1 className="font-syne text-xl font-bold text-[#121110]">{title}</h1>
        <span className="red-marker-line hidden sm:inline-block">&nbsp;</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-[#B5AFA3] hover:bg-[#121110]/5 hover:text-[#121110] transition-colors">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#D92525]" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-syne text-sm font-semibold text-[#121110]">
              {user.name}
            </p>
            <span
              className={`inline-block rounded-full px-2 py-0.5 font-mono-tech text-xs font-medium ${roleBadgeColor}`}
            >
              {user.role.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-[#B5AFA3] hover:bg-[#D92525]/10 hover:text-[#D92525] transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
