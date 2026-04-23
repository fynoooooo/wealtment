export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--gold)] mb-3 px-3 py-1 rounded-full border border-[var(--gold-glow)] bg-[var(--gold-glow)]">
      {children}
    </span>
  );
}
