import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldProps { label: string; error?: string; className?: string; }

export function Input({ label, error, className = "", ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">{label}</label>
      <input
        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--muted)]"
        {...rest}
      />
      {error && <span className="text-xs text-[var(--red)]">{error}</span>}
    </div>
  );
}

export function Select({ label, error, className = "", children, ...rest }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">{label}</label>
      <select
        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] transition-colors cursor-pointer"
        {...rest}
      >
        {children}
      </select>
      {error && <span className="text-xs text-[var(--red)]">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, className = "", ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">{label}</label>
      <textarea
        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--muted)] resize-y"
        {...rest}
      />
      {error && <span className="text-xs text-[var(--red)]">{error}</span>}
    </div>
  );
}
