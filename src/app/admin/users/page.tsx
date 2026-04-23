"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashLayout } from "@/components/layout/DashLayout";
import { CryptoTicker } from "@/components/ui/CryptoTicker";
import { getUser } from "@/lib/auth";
import { apiGetAllUsers } from "@/lib/api";    // add this to api.ts (see below)
import { formatUSD } from "@/lib/utils";
import { Search, Users, Loader, CheckCircle, TrendingUp, Shield } from "lucide-react";

// Shape from GET /admin/users
interface AdminUserRow {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  balance: number;
  bitcoinAddress?: string;
  litecoinAddress?: string;
  referralCode?: string;
  referralEarnings: number;
  hasInvested: boolean;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsersPage() {
  const router  = useRouter();
  const [users,   setUsers]   = useState<AdminUserRow[]>([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const u = getUser();
    if (!u) { router.replace("/login"); return; }
    if (!u.isAdmin) { router.replace("/user/dashboard"); return; }
    try {
      // GET /admin/users  → { success, count, users: [...] }
      const res = await apiGetAllUsers();
      setUsers(res.users ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = users.filter((u) =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Summary stats
  const totalBalance   = users.reduce((s, u) => s + (u.balance ?? 0), 0);
  const totalInvested  = users.filter((u) => u.hasInvested).length;
  const totalReferrals = users.reduce((s, u) => s + (u.referralEarnings ?? 0), 0);

  return (
    <DashLayout variant="admin">
      <CryptoTicker />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Users className="text-[var(--gold)]" size={26} />
              All Users
            </h1>
            <p className="text-[var(--muted)] text-sm mt-0.5">
              {loading ? "Loading…" : `${users.length} registered users`}
            </p>
          </div>
        </div>

        {/* Summary stats */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users size={14} className="text-[var(--gold)]" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)]">Total Users</p>
              </div>
              <p className="font-display text-2xl font-bold text-[var(--gold)]">{users.length}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-[var(--green)]" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)]">Total Balance</p>
              </div>
              <p className="font-display text-2xl font-bold text-[var(--green)]">{formatUSD(totalBalance)}</p>
            </div>
            <div className="glass rounded-xl p-4 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} className="text-[var(--teal)]" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)]">Invested Users</p>
              </div>
              <p className="font-display text-2xl font-bold text-[var(--teal)]">{totalInvested}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 bg-[var(--bg-3)] border border-[var(--border)] rounded-xl px-4 py-2.5">
          <Search size={14} className="text-[var(--muted)] shrink-0" />
          <input
            className="bg-transparent text-sm outline-none w-full placeholder:text-[var(--muted)] text-[var(--text)]"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <span className="text-xs text-[var(--muted)] shrink-0">{filtered.length} results</span>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={28} className="text-[var(--gold)] animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)]">

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <p className="text-center text-[var(--muted)] text-sm py-14">No users found.</p>
              ) : filtered.map((u) => (
                <div key={u._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--gold-glow)] border border-[rgba(212,168,67,0.2)] flex items-center justify-center text-[var(--gold)] font-bold text-sm shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{u.name}</p>
                        <p className="text-xs text-[var(--muted)] truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {u.role === "admin" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(212,168,67,0.12)] text-[var(--gold)] border border-[rgba(212,168,67,0.3)] flex items-center gap-1">
                          <Shield size={9} /> Admin
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.hasInvested
                          ? "text-[var(--green)] border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.08)]"
                          : "text-[var(--muted)] border-[var(--border)] bg-[var(--bg-3)]"
                      }`}>
                        {u.hasInvested ? "✓ Invested" : "Not invested"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[var(--bg-3)] rounded-lg px-3 py-2">
                      <p className="text-[var(--muted)] uppercase tracking-widest text-[9px]">Balance</p>
                      <p className="font-mono font-bold text-[var(--gold)] mt-0.5">{formatUSD(u.balance)}</p>
                    </div>
                    <div className="bg-[var(--bg-3)] rounded-lg px-3 py-2">
                      <p className="text-[var(--muted)] uppercase tracking-widest text-[9px]">Referral Earnings</p>
                      <p className="font-mono font-bold text-[var(--teal)] mt-0.5">{formatUSD(u.referralEarnings)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)]">Joined {fmtDate(u.createdAt)}</p>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-3)]">
                    {["User", "Role", "Balance", "Referral Earnings", "Invested?", "Joined"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-16 text-[var(--muted)] text-sm">No users found.</td></tr>
                  ) : filtered.map((u) => (
                    <tr key={u._id} className="border-b border-[var(--border)] hover:bg-[var(--bg-3)] last:border-0 transition-colors">
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--gold-glow)] border border-[rgba(212,168,67,0.2)] flex items-center justify-center text-[var(--gold)] font-bold text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{u.name}</p>
                            <p className="text-xs text-[var(--muted)] truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-5 py-4">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[rgba(212,168,67,0.12)] text-[var(--gold)] border border-[rgba(212,168,67,0.3)]">
                            <Shield size={9} /> Admin
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--bg-3)] text-[var(--muted)] border border-[var(--border)]">
                            User
                          </span>
                        )}
                      </td>
                      {/* Balance */}
                      <td className="px-5 py-4 font-mono font-bold text-[var(--gold)]">{formatUSD(u.balance)}</td>
                      {/* Referral Earnings */}
                      <td className="px-5 py-4 font-mono text-[var(--teal)]">{formatUSD(u.referralEarnings)}</td>
                      {/* Invested */}
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          u.hasInvested
                            ? "text-[var(--green)] border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.08)]"
                            : "text-[var(--muted)] border-[var(--border)] bg-[var(--bg-3)]"
                        }`}>
                          {u.hasInvested ? "✓ Yes" : "No"}
                        </span>
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-4 text-xs text-[var(--muted)] whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
