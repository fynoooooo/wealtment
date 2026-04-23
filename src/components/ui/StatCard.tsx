interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
  sub?: string;
  className?: string;
}

export function StatCard({ label, value, icon, accent = "var(--gold)", sub, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(212,168,67,0.03)] pointer-events-none" />
      {icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}>
          {icon}
        </div>
      )}
      <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)] mb-1">{label}</p>
      <p className="font-display text-2xl font-bold" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>}
    </div>
  );
}
