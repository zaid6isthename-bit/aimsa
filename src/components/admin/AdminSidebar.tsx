'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardList,
  Users,
  Megaphone,
  Trophy,
  ImageIcon,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  currentPath: string;
  role?: string;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/home', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/about', label: 'About', icon: BookOpen },
  { href: '/admin/people', label: 'People', icon: Users },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
  { href: '/admin/community', label: 'Community', icon: Megaphone },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/connect', label: 'Connect', icon: Settings },
  { href: '/admin/activity', label: 'Activity Log', icon: Activity },
];

export default function AdminSidebar({ currentPath, role }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`admin-sidebar fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!collapsed && (
            <span className="font-syne text-lg font-bold tracking-wide text-white">
              AIMSA
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded p-1 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'nav-active'
                    : 'text-white/70 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} />
                {!collapsed && (
                  <span className="font-mono-tech text-xs tracking-wider uppercase">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          {role === 'super_admin' && (
            <Link
              href="/admin/admins"
              className={`nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                currentPath.startsWith('/admin/admins')
                  ? 'nav-active'
                  : 'text-white/70 hover:text-white'
              }`}
              title={collapsed ? 'Admin Users' : undefined}
            >
              <Shield size={20} />
              {!collapsed && (
                <span className="font-mono-tech text-xs tracking-wider uppercase">
                  Admin Users
                </span>
              )}
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-2 py-3 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-white/70 hover:text-white hover:bg-white/10"
            title={collapsed ? 'View Website' : undefined}
          >
            <ExternalLink size={20} />
            {!collapsed && (
              <span className="font-mono-tech text-xs tracking-wider uppercase">
                View Website
              </span>
            )}
          </Link>
          {!collapsed && (
            <p className="font-mono-tech text-[10px] text-white/30 px-3 uppercase tracking-widest">
              AIMSA Admin Panel
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
