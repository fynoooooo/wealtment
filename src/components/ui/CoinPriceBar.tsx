"use client";
import { useState, useEffect } from "react";
import { COINS_INIT } from "@/lib/data";
import type { Coin } from "@/types";
import { formatCoinPrice } from "@/lib/utils";
export function CoinPriceBar() {
  const [coins, setCoins] = useState<Coin[]>(COINS_INIT.slice(0, 6));

  useEffect(() => {
    const iv = setInterval(() => {
      setCoins((p) =>
        p.map((c) => ({
          ...c,
          price: c.price * (1 + (Math.random() - 0.5) * 0.003),
          chg: c.chg + (Math.random() - 0.5) * 0.05,
        }))
      );
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="flex items-center gap-5 px-4 py-2.5 overflow-x-auto"
      style={{
        background: "var(--bg3)",
        borderBottom: "1px solid var(--border)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
      }}
    >
      {coins.map((c) => (
        <div key={c.sym} className="flex items-center gap-1.5 whitespace-nowrap">
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>{c.sym}</span>
          <span style={{ color: "var(--text)" }}>${ formatCoinPrice(c.price)}</span>
          <span style={{ color: c.chg >= 0 ? "var(--jade)" : "var(--crimson)" }}>
            {c.chg >= 0 ? "+" : ""}{c.chg.toFixed(2)}%
          </span>
        </div>
      ))}
      <span className="ml-auto text-[10px] uppercase tracking-widest flex-shrink-0" style={{ color: "var(--muted)" }}>
        Live Prices
      </span>
    </div>
  );
}
