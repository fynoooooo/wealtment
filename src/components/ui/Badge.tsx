type Variant = "green" | "yellow" | "red" | "blue" | "muted";

interface Props { variant?: Variant; children: React.ReactNode; className?: string; }

const V: Record<Variant, string> = {
  green:  "bg-[rgba(52,211,153,0.12)] text-[#34d399] border-[rgba(52,211,153,0.25)]",
  yellow: "bg-[rgba(212,168,67,0.12)] text-[#d4a843] border-[rgba(212,168,67,0.25)]",
  red:    "bg-[rgba(248,113,113,0.12)] text-[#f87171] border-[rgba(248,113,113,0.25)]",
  blue:   "bg-[rgba(45,212,191,0.12)] text-[#2dd4bf] border-[rgba(45,212,191,0.25)]",
  muted:  "bg-[rgba(16,31,48,1)] text-[#64748b] border-[rgba(255,255,255,0.07)]",
};

export function Badge({ variant = "muted", children, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${V[variant]} ${className}`}>
      {children}
    </span>
  );
}
