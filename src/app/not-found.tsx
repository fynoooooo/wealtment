import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 pt-16">
      <div>
        <p className="font-display text-[120px] font-black text-gold-grad leading-none">404</p>
        <h1 className="font-display text-3xl font-bold mt-4 mb-3">Page Not Found</h1>
        <p className="text-[var(--muted)] mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-2)] text-black font-bold text-sm hover:opacity-90 transition-opacity">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
