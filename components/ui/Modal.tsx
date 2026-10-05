'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="rounded-2xl w-[92vw] max-w-md p-0 backdrop:bg-black/50"
    >
      <div className="card p-6" style={{ border: 'none' }}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-serif text-xl">{title}</h2>
          <button onClick={onClose} className="muted" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
