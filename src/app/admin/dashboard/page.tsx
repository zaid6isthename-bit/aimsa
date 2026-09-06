'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  Users,
  Trophy,
  ImageIcon,
  Plus,
  TrendingUp,
  Clock,
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

interface Stats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  announcements: number;
  teamMembers: number;
  projects: number;
  achievements: number;
  galleryItems: number;
}

interface Activity {
  id: string;
  admin: string;
  action: string;
  contentType: string;
  contentName: string;
  createdAt: string;
}

const statCards = [
  { key: 'totalEvents', label: 'Total Events', icon: Calendar, color: 'bg-[#D92525]' },
  { key: 'upcomingEvents', label: 'Upcoming Events', icon: TrendingUp, color: 'bg-emerald-700' },
  { key: 'pastEvents', label: 'Past Events', icon: Clock, color: 'bg-neutral-600' },
  { key: 'announcements', label: 'Announcements', icon: Megaphone, color: 'bg-amber-600' },
  { key: 'teamMembers', label: 'Team Members', icon: Users, color: 'bg-purple-700' },
  { key: 'achievements', label: 'Achievements', icon: Trophy, color: 'bg-orange-600' },
  { key: 'galleryItems', label: 'Gallery Items', icon: ImageIcon, color: 'bg-pink-600' },
];

const quickActions = [
  { href: '/admin/home', label: 'Edit Home', icon: LayoutDashboard },
  { href: '/admin/about', label: 'Edit About', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Add Event', icon: Calendar },
  { href: '/admin/community', label: 'Add Announcement', icon: Megaphone },
  { href: '/admin/people', label: 'Add Team Member', icon: Users },
  { href: '/admin/achievements', label: 'Add Achievement', icon: Trophy },
  { href: '/admin/gallery', label: 'Upload Gallery', icon: ImageIcon },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/activity?limit=10').then((r) => r.json()),
      fetch('/api/admin/auth/me').then((r) => r.json()),
    ])
      .then(([statsData, activityData, userData]) => {
        setStats(statsData);
        setActivity(activityData.activities || []);
        if (userData.user) setUser(userData.user);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/dashboard" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Dashboard" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                  <div key={card.key} className="rounded-sm bg-[#FAF8F5] p-5 border border-black/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">{card.label}</p>
                        <p className="mt-1 text-2xl font-black text-[#121110] font-syne">
                          {(stats as unknown as Record<string, number>)?.[card.key] ?? 0}
                        </p>
                      </div>
                      <div className={`rounded-sm p-3 ${card.color}`}>
                        <card.icon size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="rounded-sm bg-[#FAF8F5] p-6 border border-black/10">
                <h2 className="mb-4 text-lg font-black text-[#121110] font-syne uppercase tracking-widest text-xs">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-2 rounded-sm border border-black/10 bg-[#FAF8F5] px-4 py-3 text-sm font-medium text-neutral-700 font-mono-tech transition-colors hover:border-[#D92525]/30 hover:bg-[#D92525]/5 hover:text-[#D92525]"
                    >
                      <Plus size={16} />
                      <action.icon size={16} />
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-sm bg-[#FAF8F5] p-6 border border-black/10">
                <h2 className="mb-4 text-lg font-black text-[#121110] font-syne uppercase tracking-widest text-xs">Recent Activity</h2>
                {activity.length === 0 ? (
                  <p className="text-sm text-neutral-500 font-mono-tech">No recent activity.</p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-sm border border-black/5 bg-[#FAF8F5] px-4 py-3"
                      >
                        <div>
                          <p className="text-sm text-[#121110] font-mono-tech">
                            <span className="font-bold">{item.admin}</span>{' '}
                            {item.action}{' '}
                            <span className="font-bold">{item.contentName}</span>
                          </p>
                          <p className="text-xs text-neutral-400 font-mono-tech uppercase tracking-widest">{item.contentType}</p>
                        </div>
                        <span className="text-xs text-neutral-400 font-mono-tech">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
