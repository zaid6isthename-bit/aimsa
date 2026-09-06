'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

interface Activity {
  id: string;
  admin: string;
  action: string;
  contentType: string;
  contentName: string;
  createdAt: string;
}

export default function ActivityPage() {
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetch(`/api/admin/activity?limit=${limit}`)
      .then((r) => r.json())
      .then((data) => setActivities(data.activities || []))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch('/api/admin/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, [limit]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/activity" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Activity Log" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">{activities.length} activities</p>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setLoading(true); }}
              className="admin-input w-auto"
            >
              <option value={25}>Last 25</option>
              <option value={50}>Last 50</option>
              <option value={100}>Last 100</option>
            </select>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : activities.length === 0 ? (
            <div className="rounded-sm bg-[#FAF8F5] p-12 text-center border border-black/10">
              <p className="text-neutral-500 font-mono-tech">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="rounded-sm bg-[#FAF8F5] border border-black/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#E6E1D7]">
                    <th className="px-4 py-3 text-left font-bold text-[#121110] font-mono-tech text-xs uppercase tracking-widest">Admin</th>
                    <th className="px-4 py-3 text-left font-bold text-[#121110] font-mono-tech text-xs uppercase tracking-widest">Action</th>
                    <th className="px-4 py-3 text-left font-bold text-[#121110] font-mono-tech text-xs uppercase tracking-widest">Content Type</th>
                    <th className="px-4 py-3 text-left font-bold text-[#121110] font-mono-tech text-xs uppercase tracking-widest">Content Name</th>
                    <th className="px-4 py-3 text-left font-bold text-[#121110] font-mono-tech text-xs uppercase tracking-widest">Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((item) => (
                    <tr key={item.id} className="border-b border-black/5 last:border-0 hover:bg-[#E6E1D7]/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-[#121110] font-mono-tech">{item.admin}</td>
                      <td className="px-4 py-3 text-neutral-600 capitalize font-mono-tech">{item.action}</td>
                      <td className="px-4 py-3 text-neutral-600 capitalize font-mono-tech">{item.contentType}</td>
                      <td className="px-4 py-3 text-neutral-600 font-mono-tech">{item.contentName}</td>
                      <td className="px-4 py-3 text-neutral-500 text-xs font-mono-tech">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
