"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";
interface Toast { id: number; message: string; type: ToastType; }

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

const ICONS: Record<ToastType, string> = {
  success: "✓", error: "✕", info: "ℹ", warning: "⚠",
};

const COLORS: Record<ToastType, string> = {
  success: "var(--jade)",
  error: "var(--crimson)",
  info: "var(--sky)",
  warning: "var(--gold)",
};

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  }, []);

  const success = useCallback((m: string) => show(m, "success"), [show]);
  const error = useCallback((m: string) => show(m, "error"), [show]);
  const info = useCallback((m: string) => show(m, "info"), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      <div
        className="fixed top-20 right-4 z-[9999] flex flex-col gap-2"
        style={{ pointerEvents: "none" }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl"
            style={{
              background: "var(--bg2)",
              border: `1px solid ${COLORS[t.type]}44`,
              borderLeft: `3px solid ${COLORS[t.type]}`,
              color: COLORS[t.type],
              minWidth: 280,
              maxWidth: 380,
              pointerEvents: "all",
              animation: "fadeSlideUp 0.3s ease",
            }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: `${COLORS[t.type]}18`, color: COLORS[t.type] }}
            >
              {ICONS[t.type]}
            </span>
            <span style={{ color: "var(--text)" }}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
