import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-bold tracking-widest uppercase text-slate-500">{label}</label>}
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600",
        "focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all text-sm font-body",
        error && "border-red-500/50",
        className
      )}
      {...props}
    />
    {error && <p className="text-red-400 text-xs">{error}</p>}
  </div>
));
Input.displayName = "Input";
export default Input;
