"use client";
import { useState, useEffect } from "react";
import { COINS_INIT } from "@/lib/data";
import { formatCoinPrice } from "@/lib/utils";
import type { Coin } from "@/types";

export function CryptoTicker() {
  const [coins, setCoins] = useState<Coin[]>(COINS_INIT);

  useEffect(() => {
    const iv = setInterval(() => {
      setCoins((prev) =>
        prev.map((c) => ({
          ...c,
          price: c.price * (1 + (Math.random() - 0.5) * 0.003),
          chg: c.chg + (Math.random() - 0.5) * 0.05,
        }))
      );
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  const items = [...coins, ...coins];

  return (
    <div className="overflow-hidden bg-[var(--bg-2)] border-b border-[var(--border)] py-2.5">
      <div className="ticker-track">
        {items.map((c, i) => (
          <span key={i} className="inline-flex items-center gap-2 pr-10 font-mono text-xs">
            <span className="font-semibold text-[var(--gold)]">{c.sym}</span>
            <span className="text-[var(--text)]">${formatCoinPrice(c.price)}</span>
            <span className={c.chg >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"}>
              {c.chg >= 0 ? "▲" : "▼"} {Math.abs(c.chg).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
