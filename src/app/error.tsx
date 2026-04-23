"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 pt-16">
      <div>
        <p className="font-display text-6xl font-black text-[var(--red)] mb-4">Oops!</p>
        <h1 className="font-display text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-[var(--muted)] mb-8">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="px-7 py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-2)] text-black font-bold text-sm hover:opacity-90 transition-opacity">
          Try Again
        </button>
      </div>
    </div>
  );
}
