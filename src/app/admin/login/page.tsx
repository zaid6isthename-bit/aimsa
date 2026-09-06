'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center paper-crumpled-bg px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#D92525]">
            <span className="text-2xl font-black text-white font-syne">A</span>
          </div>
          <h1 className="text-2xl font-black text-[#121110] font-syne">AIMSA Admin Portal</h1>
          <p className="mt-1 text-sm text-neutral-500 font-mono-tech uppercase tracking-widest">Sign in to manage your content</p>
        </div>

        {/* Card */}
        <div className="rounded-sm bg-[#FAF8F5] p-8 border border-black/10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-sm bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-mono-tech">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="admin-input"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">
          AIMSA &copy; {new Date().getFullYear()}
        </p>
        <div className="mt-4 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-neutral-500 hover:text-[#D92525] transition-colors"
          >
            &larr; Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
