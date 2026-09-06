'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { useToast, ToastProvider } from '@/components/admin/Toast';
import { Save, Download, Database, Trash2 } from 'lucide-react';

interface SiteSettings {
  hero_heading: string;
  hero_tagline: string;
  hero_description: string;
  about_heading: string;
  about_description: string;
  mission: string;
  vision: string;
  footer_text: string;
}

interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  instagram: string;
  github: string;
  linkedin: string;
}

function SettingsContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [site, setSite] = useState<SiteSettings>({
    hero_heading: '', hero_tagline: '', hero_description: '',
    about_heading: '', about_description: '', mission: '', vision: '', footer_text: '',
  });
  const [contacts, setContacts] = useState<ContactSettings>({
    email: '', phone: '', address: '', instagram: '', github: '', linkedin: '',
  });
  const [loading, setLoading] = useState(true);
  const [savingSite, setSavingSite] = useState(false);
  const [savingContacts, setSavingContacts] = useState(false);
  const [backups, setBackups] = useState<{ filename: string; size: number; created: string }[]>([]);
  const [backing, setBacking] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/settings').then((r) => r.json()),
      fetch('/api/admin/contacts').then((r) => r.json()),
      fetch('/api/admin/auth/me').then((r) => r.json()),
    ])
      .then(([siteData, contactData, userData]) => {
        if (siteData.settings) setSite(siteData.settings);
        if (contactData.contacts) setContacts(contactData.contacts);
        if (userData.user) setUser(userData.user);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch('/api/admin/backup')
      .then((r) => r.json())
      .then((d) => setBackups(d.backups || []))
      .catch(() => {});
  }, []);

  const handleCreateBackup = async () => {
    setBacking(true);
    try {
      const res = await fetch('/api/admin/backup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: 'Backup created: ' + data.filename, type: 'success' });
      const list = await fetch('/api/admin/backup').then((r) => r.json());
      setBackups(list.backups || []);
    } catch {
      toast({ title: 'Backup failed', type: 'error' });
    } finally {
      setBacking(false);
    }
  };

  const handleDownloadBackup = async (filename: string) => {
    try {
      const res = await fetch(`/api/admin/backup?action=download&file=${encodeURIComponent(filename)}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'Download failed', type: 'error' });
    }
  };

  const handleSaveSite = async () => {
    setSavingSite(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Site settings saved', type: 'success' });
    } catch {
      toast({ title: 'Failed to save settings', type: 'error' });
    } finally {
      setSavingSite(false);
    }
  };

  const handleSaveContacts = async () => {
    setSavingContacts(true);
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacts),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Contact settings saved', type: 'success' });
    } catch {
      toast({ title: 'Failed to save contacts', type: 'error' });
    } finally {
      setSavingContacts(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/connect" role={user.role} />
      <div className="flex-1 ml-64"><AdminHeader title="Settings" user={user} /><main className="p-6 bg-[#E6E1D7] min-h-screen"><LoadingSpinner /></main></div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/connect" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Settings" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen space-y-8 max-w-4xl">
          {/* Site Settings */}
          <section className="rounded-sm bg-[#FAF8F5] p-6 border border-black/10">
            <h2 className="mb-4 text-xs font-black text-[#121110] font-syne uppercase tracking-widest">Site Settings</h2>
            <div className="space-y-4">
              <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Hero Heading</label><input className="admin-input" value={site.hero_heading} onChange={(e) => setSite({ ...site, hero_heading: e.target.value })} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Hero Tagline</label><input className="admin-input" value={site.hero_tagline} onChange={(e) => setSite({ ...site, hero_tagline: e.target.value })} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Hero Description</label><textarea className="admin-input" rows={3} value={site.hero_description} onChange={(e) => setSite({ ...site, hero_description: e.target.value })} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">About Heading</label><input className="admin-input" value={site.about_heading} onChange={(e) => setSite({ ...site, about_heading: e.target.value })} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">About Description</label><textarea className="admin-input" rows={3} value={site.about_description} onChange={(e) => setSite({ ...site, about_description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Mission</label><textarea className="admin-input" rows={3} value={site.mission} onChange={(e) => setSite({ ...site, mission: e.target.value })} /></div>
                <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Vision</label><textarea className="admin-input" rows={3} value={site.vision} onChange={(e) => setSite({ ...site, vision: e.target.value })} /></div>
              </div>
              <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Footer Text</label><input className="admin-input" value={site.footer_text} onChange={(e) => setSite({ ...site, footer_text: e.target.value })} /></div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleSaveSite} disabled={savingSite} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50">
                <Save size={16} /> {savingSite ? 'Saving...' : 'Save Site Settings'}
              </button>
            </div>
          </section>

          {/* Contact Settings */}
          <section className="rounded-sm bg-[#FAF8F5] p-6 border border-black/10">
            <h2 className="mb-4 text-xs font-black text-[#121110] font-syne uppercase tracking-widest">Contact Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Email</label><input type="email" className="admin-input" value={contacts.email} onChange={(e) => setContacts({ ...contacts, email: e.target.value })} /></div>
                <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Phone</label><input className="admin-input" value={contacts.phone} onChange={(e) => setContacts({ ...contacts, phone: e.target.value })} /></div>
              </div>
              <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Address</label><input className="admin-input" value={contacts.address} onChange={(e) => setContacts({ ...contacts, address: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Instagram</label><input className="admin-input" value={contacts.instagram} onChange={(e) => setContacts({ ...contacts, instagram: e.target.value })} /></div>
                <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">GitHub</label><input className="admin-input" value={contacts.github} onChange={(e) => setContacts({ ...contacts, github: e.target.value })} /></div>
                <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">LinkedIn</label><input className="admin-input" value={contacts.linkedin} onChange={(e) => setContacts({ ...contacts, linkedin: e.target.value })} /></div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleSaveContacts} disabled={savingContacts} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50">
                <Save size={16} /> {savingContacts ? 'Saving...' : 'Save Contact Info'}
              </button>
            </div>
          </section>

          {/* Database Backup */}
          {user.role === 'super_admin' && (
            <section className="rounded-sm bg-[#FAF8F5] p-6 border border-black/10">
              <div className="flex items-center gap-3 mb-4">
                <Database size={20} className="text-neutral-600" />
                <h2 className="text-xs font-black text-[#121110] font-syne uppercase tracking-widest">Database Backup</h2>
              </div>
              <p className="text-sm text-neutral-500 mb-4 font-mono-tech">Create and download backups of the SQLite database. Store backups safely.</p>
              <div className="mb-4">
                <button onClick={handleCreateBackup} disabled={backing} className="flex items-center gap-2 rounded-sm bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors">
                  <Database size={16} /> {backing ? 'Creating...' : 'Create Backup'}
                </button>
              </div>
              {backups.length > 0 && (
                <div className="space-y-2">
                  {backups.map((b) => (
                    <div key={b.filename} className="flex items-center justify-between rounded-sm border border-black/5 bg-[#FAF8F5] px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-[#121110] font-mono-tech">{b.filename}</p>
                        <p className="text-xs text-neutral-400 font-mono-tech">{(b.size / 1024).toFixed(1)} KB — {new Date(b.created).toLocaleString()}</p>
                      </div>
                      <button onClick={() => handleDownloadBackup(b.filename)} className="btn-secondary flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs font-medium">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {backups.length === 0 && (
                <p className="text-sm text-neutral-400 font-mono-tech">No backups yet.</p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <ToastProvider><SettingsContent /></ToastProvider>;
}
