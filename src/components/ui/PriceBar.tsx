"use client";
import { useState, useEffect } from "react";
import { COINS_INIT } from "@/lib/data";
import { formatCoinPrice} from "@/lib/utils";
import type { Coin } from "@/types";

export default function PriceBar() {
  const [coins, setCoins] = useState<Coin[]>(COINS_INIT.slice(0, 6));
  useEffect(() => {
    const iv = setInterval(() => {
      setCoins((p) => p.map((c) => ({ ...c, price: c.price * (1 + (Math.random() - 0.5) * 0.002) })));
    }, 3000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="bg-[#0b1628]/80 border-b border-white/5 px-4 py-2 flex gap-6 overflow-x-auto">
      {coins.map((c) => (
        <div key={c.sym} className="flex items-center gap-2 whitespace-nowrap font-mono text-xs" style={{fontFamily:"var(--font-mono)"}}>
          <span className="text-amber-400 font-bold">{c.sym}</span>
          <span className="text-slate-300">${formatCoinPrice(c.price)}</span>
          <span className={c.chg >= 0 ? "text-emerald-400" : "text-red-400"}>
            {c.chg >= 0 ? "+" : ""}{c.chg.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
