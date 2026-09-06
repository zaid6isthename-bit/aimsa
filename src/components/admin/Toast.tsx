'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastItem {
  id: number;
  title: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  toast: (args: { title: string; type: 'success' | 'error' | 'info' }) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    ({ title, type }: { title: string; type: 'success' | 'error' | 'info' }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, title, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle size={18} className="text-[#2D8B4E]" />,
    error: <AlertCircle size={18} className="text-[#D92525]" />,
    info: <Info size={18} className="text-[#8B6914]" />,
  };

  const bgColors = {
    success: 'border-[#D4EDDA] bg-[#FAF8F5]',
    error: 'border-[#D92525]/30 bg-[#FAF8F5]',
    info: 'border-[#F3E8D0] bg-[#FAF8F5]',
  };

  const accentBorders = {
    success: 'border-l-4 border-l-[#2D8B4E]',
    error: 'border-l-4 border-l-[#D92525]',
    info: 'border-l-4 border-l-[#8B6914]',
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded border px-4 py-3 shadow-lg animate-in slide-in-from-right ${bgColors[t.type]} ${accentBorders[t.type]}`}
          >
            {icons[t.type]}
            <p className="font-mono-tech text-sm font-medium text-[#121110]">
              {t.title}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 rounded p-0.5 text-[#B5AFA3] hover:text-[#121110]"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
