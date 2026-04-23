"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CryptoTicker } from "@/components/ui/CryptoTicker";
import { SectionTag } from "@/components/ui/SectionTag";
import { CRYPTO_IMAGES } from "@/lib/data";
import { apiGetPlans } from "@/lib/api";
import { formatUSD } from "@/lib/utils";
import { ArrowRight, CheckCircle, Loader } from "lucide-react";
import type { Plan } from "@/types";
import Package  from './components/Package';
export default function PlansPage() {
  const [plans,   setPlans]   = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetPlans()
      .then((res) => setPlans(res.plans ?? []))
      .catch(() => {/* silent — show empty */})
      .finally(() => setLoading(false));
  }, []);

  const rate   = (p: Plan) => p.returnRate ?? p.pct ?? 0;
  const minAmt = (p: Plan) => p.minAmount  ?? p.min  ?? 0;
  const maxAmt = (p: Plan) => p.maxAmount  ?? p.max  ?? null;

  return (
    <>
      <CryptoTicker />
      <section className="pt-32 pb-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--gold-glow)] blur-[140px] opacity-10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <SectionTag>Investment Plans</SectionTag>
            <h1 className="font-display text-5xl font-black mt-2 mb-4">Choose Your <span className="text-gold-grad">Plan</span></h1>
            <p className="text-[var(--muted-2)] max-w-xl mx-auto">
              All plans include instant withdrawals, principal return, and unlimited deposits.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] mb-14 h-64">
            <Image src={CRYPTO_IMAGES.btcGold} alt="Bitcoin" fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-transparent to-[var(--bg)]" />
          </div>
<Package show={false}/>
                  

          {/* Guarantees */}
          <div className="glass rounded-2xl p-10 text-center">
            <h2 className="font-display text-3xl font-bold mb-8">All Plans Include</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {["Instant Withdrawals","Principal Return","24/7 Support","UK Regulated"].map((g) => (
                <div key={g} className="flex items-center gap-2 justify-center text-sm font-medium">
                  <CheckCircle size={16} className="text-[var(--gold)]" /> {g}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
