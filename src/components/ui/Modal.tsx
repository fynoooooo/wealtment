"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, subtitle, children }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--bg-2)] border border-[var(--border-2)] shadow-2xl p-6 relative anim-slide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[var(--bg-3)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <X size={15} />
        </button>
        <h2 className="font-display text-xl font-bold mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-[var(--muted)] mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
