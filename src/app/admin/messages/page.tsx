"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashLayout } from "@/components/layout/DashLayout";
import { CryptoTicker } from "@/components/ui/CryptoTicker";
import { getUser } from "@/lib/auth";
import endpointRoute from "@/lib/endpointRoute";
import {
  Mail, MailOpen, Search, Filter,
  Loader, RefreshCw, CheckCheck, Clock,
} from "lucide-react";
import toast from "react-hot-toast";

// ── Types ────────────────────────────────────────────────────────────────────
interface ContactMessage {
  _id: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── API calls (inline — add to api.ts if you prefer) ─────────────────────────
const apiGetMessages  = () =>
  endpointRoute.get("/contact").then((r) => r.data);

const apiMarkAsRead   = (id: string) =>
  endpointRoute.patch(`/contact/${id}/read`).then((r) => r.data);

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

type FilterType = "all" | "unread" | "read";

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminMessagesPage() {
  const router  = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter,   setFilter]   = useState<FilterType>("all");
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [expanded,  setExpanded]  = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const u = getUser();
    if (!u) { router.replace("/login"); return; }
    if (!u.isAdmin) { router.replace("/user/dashboard"); return; }
    setLoading(true);
    try {
      // GET /api/contact → { success, count, data: [...] }
      const res = await apiGetMessages();
      setMessages(res.data ?? []);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMarkRead = async (msg: ContactMessage) => {
    if (msg.isRead) return;
    setMarkingId(msg._id);
    try {
      // PATCH /api/contact/:id/read
      await apiMarkAsRead(msg._id);
      setMessages((p) =>
        p.map((m) => m._id === msg._id ? { ...m, isRead: true } : m)
      );
      toast.success("Marked as read.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed.");
    } finally {
      setMarkingId(null);
    }
  };

  // Counts
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const readCount   = messages.filter((m) =>  m.isRead).length;

  // Filtered + searched list
  const filtered = messages.filter((m) => {
    const matchFilter =
      filter === "all"    ? true :
      filter === "unread" ? !m.isRead :
      m.isRead;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.email.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <DashLayout variant="admin">
      <CryptoTicker />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Mail className="text-[var(--gold)]" size={26} />
              Contact Messages
            </h1>
            <p className="text-[var(--muted)] text-sm mt-0.5">
              {loading ? "Loading…" : `${messages.length} total · ${unreadCount} unread`}
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-2)] text-[var(--muted)] text-xs font-bold hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap gap-2">
          {([
            { key: "all",    label: "All",    count: messages.length, color: "text-[var(--text)]" },
            { key: "unread", label: "Unread", count: unreadCount,     color: "text-[var(--gold)]" },
            { key: "read",   label: "Read",   count: readCount,       color: "text-[var(--green)]" },
          ] as { key: FilterType; label: string; count: number; color: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                filter === tab.key
                  ? "border-[var(--gold)] bg-[var(--gold-glow)] text-[var(--gold)]"
                  : "glass text-[var(--muted)] hover:border-[var(--border-2)]"
              }`}
            >
              <span className={tab.color}>{tab.count}</span>
              <span className="ml-1.5">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="flex items-center gap-2 bg-[var(--bg-3)] border border-[var(--border)] rounded-xl px-4 py-2.5">
          <Search size={14} className="text-[var(--muted)] shrink-0" />
          <input
            className="bg-transparent text-sm outline-none w-full placeholder:text-[var(--muted)] text-[var(--text)]"
            placeholder="Search by email, phone, or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <span className="text-xs text-[var(--muted)] shrink-0 flex items-center gap-1">
              <Filter size={11} /> {filtered.length}
            </span>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={28} className="text-[var(--gold)] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl py-20 text-center">
            <Mail size={36} className="text-[var(--muted)] mx-auto mb-4 opacity-30" />
            <p className="text-[var(--muted)] font-semibold text-sm">
              {filter === "all" ? "No messages yet." : `No ${filter} messages.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg) => {
              const isExpanded = expanded === msg._id;
              return (
                <div
                  key={msg._id}
                  className={`rounded-2xl border transition-all ${
                    msg.isRead
                      ? "border-[var(--border)] bg-[var(--bg-card)]"
                      : "border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.03)]"
                  }`}
                >
                  {/* Card header */}
                  <div
                    className="flex items-start gap-3 p-4 cursor-pointer"
                    onClick={() => setExpanded(isExpanded ? null : msg._id)}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.isRead
                        ? "bg-[var(--bg-3)] text-[var(--muted)]"
                        : "bg-[var(--gold-glow)] text-[var(--gold)]"
                    }`}>
                      {msg.isRead
                        ? <MailOpen size={16} />
                        : <Mail size={16} />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`font-semibold text-sm truncate ${!msg.isRead ? "text-[var(--gold)]" : ""}`}>
                            {msg.email}
                          </p>
                          <p className="text-xs text-[var(--muted)]">{msg.phone}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[var(--gold)] shrink-0" />
                          )}
                          <span className="text-[10px] text-[var(--muted)] whitespace-nowrap">
                            {fmtDate(msg.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Message preview / full */}
                      <p className={`text-sm text-[var(--muted)] mt-2 leading-relaxed ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}>
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Expanded actions */}
                  {isExpanded && (
                    <div className="px-4 pb-4 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                        <Clock size={11} />
                        <span>Received {fmtDate(msg.createdAt)}</span>
                      </div>

                      {msg.isRead ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--green)] font-semibold px-3 py-1.5 rounded-lg bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.2)]">
                          <CheckCheck size={13} /> Read
                        </span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkRead(msg); }}
                          disabled={markingId === msg._id}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--gold)] to-[var(--gold-2)] text-black hover:opacity-90 transition-opacity disabled:opacity-60"
                        >
                          {markingId === msg._id
                            ? <><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Marking…</>
                            : <><CheckCheck size={13} /> Mark as Read</>
                          }
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Summary footer ── */}
        {!loading && messages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-[var(--gold)]">{unreadCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">Unread</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-[var(--green)]">{readCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">Read</p>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
