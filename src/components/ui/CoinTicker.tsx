"use client";
import { useState, useEffect } from "react";
import { COINS_INIT } from "@/lib/data";
import { formatCoinPrice } from "@/lib/utils";
import type { Coin } from "@/types";

export default function CoinTicker() {
  const [coins, setCoins] = useState<Coin[]>(COINS_INIT);

  useEffect(() => {
    const iv = setInterval(() => {
      setCoins((p) =>
        p.map((c) => ({
          ...c,
          price: c.price * (1 + (Math.random() - 0.5) * 0.003),
          chg:   c.chg  + (Math.random() - 0.5) * 0.05,
        }))
      );
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  const items = [...coins, ...coins];

  return (
    <div className="bg-[#0b1628] border-b border-white/5 overflow-hidden py-2.5">
      <div className="flex gap-10 animate-ticker whitespace-nowrap">
        {items.map((c, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-sm" style={{fontFamily:"var(--font-mono)"}}>
            <span className="text-amber-400 font-semibold">{c.sym}</span>
            <span className="text-slate-300">${formatCoinPrice(c.price)}</span>
            <span className={c.chg >= 0 ? "text-emerald-400" : "text-red-400"}>
              {c.chg >= 0 ? "▲" : "▼"}{Math.abs(c.chg).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
