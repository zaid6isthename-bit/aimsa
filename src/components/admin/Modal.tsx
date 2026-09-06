'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 admin-modal-overlay"
        onClick={onClose}
      />
      <div
        className={`relative ${maxWidth} w-full max-h-[90vh] overflow-y-auto rounded admin-modal-content`}
      >
        <div className="tape-effect sticky top-0 flex items-center justify-between border-b border-[#B5AFA3]/30 bg-[#FAF8F5] px-6 py-4 rounded-t">
          <h2 className="font-syne text-lg font-bold text-[#121110]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#B5AFA3] hover:bg-[#121110]/5 hover:text-[#121110] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
