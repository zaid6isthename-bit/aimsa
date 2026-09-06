'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-[#D92525]/10 p-3">
          <AlertTriangle size={24} className="text-[#D92525]" />
        </div>
        <p className="font-mono-tech text-sm text-[#121110]/70">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn-primary"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
