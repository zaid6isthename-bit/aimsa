'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { useToast, ToastProvider } from '@/components/admin/Toast';
import { Plus, Image, Star, Trash2, Upload } from 'lucide-react';

const imageCategories = ['Event', 'Workshop', 'Campus', 'Team', 'Other'];

interface Album {
  id: string;
  title: string;
  description: string;
  category: string;
  coverUrl: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  caption: string;
  category: string;
  albumId: string;
  featured: boolean;
}

const emptyAlbum: Album = { id: '', title: '', description: '', category: 'Event', coverUrl: '' };
const emptyImage: GalleryImage = { id: '', url: '', title: '', caption: '', category: 'Event', albumId: '', featured: false };

function GalleryContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [tab, setTab] = useState<'albums' | 'images'>('albums');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumModal, setAlbumModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumForm, setAlbumForm] = useState<Album>(emptyAlbum);
  const [imageForm, setImageForm] = useState<GalleryImage>(emptyImage);
  const [saving, setSaving] = useState(false);
  const [deleteAlbumTarget, setDeleteAlbumTarget] = useState<Album | null>(null);
  const [deleteImageTarget, setDeleteImageTarget] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/admin/gallery/albums');
      const data = await res.json();
      setAlbums(data.albums || data || []);
    } catch { /* ignore */ }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/gallery/images');
      const data = await res.json();
      setImages(data.images || data || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    Promise.all([fetchAlbums(), fetchImages()]).finally(() => setLoading(false));
    fetch('/api/admin/auth/me').then((r) => r.json()).then((d) => { if (d.user) setUser(d.user); }).catch(() => {});
  }, []);

  const openAddAlbum = () => { setEditingAlbum(null); setAlbumForm(emptyAlbum); setAlbumModal(true); };
  const openEditAlbum = (a: Album) => { setEditingAlbum(a); setAlbumForm({ ...a }); setAlbumModal(true); };

  const handleSaveAlbum = async () => {
    setSaving(true);
    try {
      const method = editingAlbum ? 'PUT' : 'POST';
      const url = editingAlbum ? `/api/admin/gallery/albums/${editingAlbum.id}` : '/api/admin/gallery/albums';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(albumForm) });
      if (!res.ok) throw new Error();
      toast({ title: editingAlbum ? 'Album updated' : 'Album created', type: 'success' });
      setAlbumModal(false);
      fetchAlbums();
    } catch {
      toast({ title: 'Failed to save album', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!deleteAlbumTarget) return;
    try {
      await fetch(`/api/admin/gallery/albums/${deleteAlbumTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Album deleted', type: 'success' });
      fetchAlbums();
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    }
  };

  const handleSaveImage = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageForm),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Image added', type: 'success' });
      setImageModal(false);
      setImageForm(emptyImage);
      fetchImages();
    } catch {
      toast({ title: 'Failed to add image', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageTarget) return;
    try {
      await fetch(`/api/admin/gallery/images/${deleteImageTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Image removed', type: 'success' });
      fetchImages();
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    }
  };

  const toggleImageFeatured = async (img: GalleryImage) => {
    try {
      await fetch(`/api/admin/gallery/images/${img.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...img, featured: !img.featured }),
      });
      fetchImages();
    } catch { /* ignore */ }
  };

  const albumColumns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description', render: (v: unknown) => <span className="truncate max-w-[200px] block font-mono-tech">{(v as string) || '—'}</span> },
  ];

  if (loading) return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/gallery" role={user.role} />
      <div className="flex-1 ml-64"><AdminHeader title="Gallery" user={user} /><main className="p-6 bg-[#E6E1D7] min-h-screen"><LoadingSpinner /></main></div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/gallery" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Gallery" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          {/* Tabs */}
          <div className="mb-6 flex items-center gap-4 border-b border-black/10 pb-3">
            <button onClick={() => setTab('albums')} className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-widest font-mono-tech transition-colors ${tab === 'albums' ? 'border-b-2 border-[#D92525] text-[#D92525]' : 'text-neutral-500 hover:text-neutral-700'}`}>
              Albums ({albums.length})
            </button>
            <button onClick={() => setTab('images')} className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-widest font-mono-tech transition-colors ${tab === 'images' ? 'border-b-2 border-[#D92525] text-[#D92525]' : 'text-neutral-500 hover:text-neutral-700'}`}>
              Images ({images.length})
            </button>
            <div className="ml-auto">
              {tab === 'albums' ? (
                <button onClick={openAddAlbum} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold">
                  <Plus size={16} /> Add Album
                </button>
              ) : (
                <button onClick={() => { setImageForm(emptyImage); setImageModal(true); }} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold">
                  <Plus size={16} /> Add Image
                </button>
              )}
            </div>
          </div>

          {tab === 'albums' ? (
            <DataTable columns={albumColumns} data={albums as unknown as Record<string, unknown>[]} onEdit={(r) => openEditAlbum(r as unknown as Album)} onDelete={(r) => setDeleteAlbumTarget(r as unknown as Album)} emptyMessage="No albums found" />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-sm border border-black/10 bg-[#FAF8F5]">
                  <div className="aspect-square bg-neutral-100">
                    {img.url ? (
                      <img src={img.url} alt={img.title || img.caption} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center"><Image size={32} className="text-neutral-300" /></div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-[#121110] truncate font-mono-tech">{img.title || 'Untitled'}</p>
                    <p className="text-xs text-neutral-500 truncate font-mono-tech">{img.caption}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => toggleImageFeatured(img)} className={`rounded-sm p-1 transition-colors ${img.featured ? 'text-yellow-500' : 'text-neutral-300 hover:text-yellow-400'}`}>
                        <Star size={14} className={img.featured ? 'fill-current' : ''} />
                      </button>
                      <button onClick={() => setDeleteImageTarget(img)} className="rounded-sm p-1 text-neutral-300 hover:text-[#D92525] transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Album Modal */}
      <Modal isOpen={albumModal} onClose={() => setAlbumModal(false)} title={editingAlbum ? 'Edit Album' : 'Add Album'}>
        <div className="space-y-4">
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Title</label><input className="admin-input" value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Description</label><textarea className="admin-input" rows={3} value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Category</label><input className="admin-input" value={albumForm.category} onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Cover URL</label><input className="admin-input" value={albumForm.coverUrl} onChange={(e) => setAlbumForm({ ...albumForm, coverUrl: e.target.value })} /></div>
          <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
            <button onClick={() => setAlbumModal(false)} className="btn-secondary rounded-sm px-4 py-2 text-sm font-medium">Cancel</button>
            <button onClick={handleSaveAlbum} disabled={saving} className="btn-primary rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50">
              {saving ? 'Saving...' : editingAlbum ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal isOpen={imageModal} onClose={() => setImageModal(false)} title="Add Image">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Image</label>
            <div className="flex items-start gap-4">
              {imageForm.url && (
                <div className="relative w-24 h-24 rounded-sm overflow-hidden border border-black/15 flex-shrink-0">
                  <img src={imageForm.url} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImageForm({ ...imageForm, url: '' })} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"><Trash2 size={10} /></button>
                </div>
              )}
              <label className="flex flex-col items-center justify-center flex-1 h-24 border-2 border-dashed border-black/20 rounded-sm cursor-pointer hover:border-[#D92525] transition-colors bg-white/50">
                <div className="flex flex-col items-center justify-center py-2">
                  <Upload size={18} className="text-neutral-400 mb-1" />
                  <span className="text-[10px] font-mono-tech text-neutral-500 uppercase">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                </div>
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  setUploading(true);
                  try {
                    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'gallery');
                    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                    const data = await res.json();
                    if (data.url) setImageForm({ ...imageForm, url: data.url });
                    else toast({ title: 'Upload failed', type: 'error' });
                  } catch { toast({ title: 'Upload failed', type: 'error' }); }
                  finally { setUploading(false); }
                }} />
              </label>
            </div>
            <input className="admin-input mt-2" placeholder="Or enter image URL" value={imageForm.url} onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })} />
          </div>
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Title</label><input className="admin-input" value={imageForm.title} onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Caption</label><input className="admin-input" value={imageForm.caption} onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Category</label>
              <select className="admin-input" value={imageForm.category} onChange={(e) => setImageForm({ ...imageForm, category: e.target.value })}>
                {imageCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Album</label>
              <select className="admin-input" value={imageForm.albumId} onChange={(e) => setImageForm({ ...imageForm, albumId: e.target.value })}>
                <option value="">No Album</option>
                {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="imgFeatured" checked={imageForm.featured} onChange={(e) => setImageForm({ ...imageForm, featured: e.target.checked })} className="h-4 w-4 rounded-sm border-black/20 text-[#D92525] focus:ring-[#D92525]" />
            <label htmlFor="imgFeatured" className="text-sm font-medium text-[#121110] font-mono-tech">Featured</label>
          </div>
          <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
            <button onClick={() => setImageModal(false)} className="btn-secondary rounded-sm px-4 py-2 text-sm font-medium">Cancel</button>
            <button onClick={handleSaveImage} disabled={saving} className="btn-primary rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50">
              {saving ? 'Adding...' : 'Add Image'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteAlbumTarget} onClose={() => setDeleteAlbumTarget(null)} onConfirm={handleDeleteAlbum} title="Delete Album" message={`Delete album "${deleteAlbumTarget?.title}"?`} />
      <ConfirmDialog isOpen={!!deleteImageTarget} onClose={() => setDeleteImageTarget(null)} onConfirm={handleDeleteImage} title="Delete Image" message="Remove this image from the gallery?" />
    </div>
  );
}

export default function GalleryPage() {
  return <ToastProvider><GalleryContent /></ToastProvider>;
}
