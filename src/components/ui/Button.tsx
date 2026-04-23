import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", loading, children, className = "", disabled, ...rest }: Props) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes: Record<string, string> = { sm: "text-xs px-3 py-1.5", md: "text-sm px-5 py-2.5", lg: "text-sm px-7 py-3.5" };
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-[var(--gold)] to-[var(--gold-2)] text-black hover:opacity-90 shadow-lg",
    outline: "border border-[var(--border-2)] text-[var(--muted-2)] hover:border-[var(--gold)] hover:text-[var(--gold)]",
    ghost:   "text-[var(--muted)] hover:text-[var(--gold)] hover:bg-[var(--gold-glow)]",
    danger:  "bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.3)] text-[var(--red)] hover:bg-[rgba(248,113,113,0.2)]",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
