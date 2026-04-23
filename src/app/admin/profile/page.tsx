"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashLayout } from "@/components/layout/DashLayout";
import { CryptoTicker } from "@/components/ui/CryptoTicker";
import { getUser, setUser as persist } from "@/lib/auth";
import { apiGetProfile, apiUpdateProfile, apiChangePassword } from "@/lib/api";
import { User, Bitcoin, ShieldCheck, Lock } from "lucide-react";
import toast from "react-hot-toast";
import type { User as UserType } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user,    setUser]    = useState<UserType | null>(null);
  const [tab,     setTab]     = useState<"profile" | "password">("profile");
  const [form,    setForm]    = useState({ name: "", bitcoinAddress: "", litecoinAddress: "" });
  const [pwForm,  setPwForm]  = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    

     const u = getUser();
         setUser(u);

    if (!u) { router.replace("/login"); return; }
    if (!u.isAdmin) { router.replace("/user/dashboard"); return; }
    setForm({ name: u.name, bitcoinAddress: u.bitcoinAddress ?? u.bitcoin ?? "", litecoinAddress: u.litecoinAddress ?? u.litecoin ?? "" });
    // Fetch fresh from API
          console.log('before fresh', u);

    apiGetProfile().then((res) => {
      const fresh = res.user ?? res;
      console.log('user', fresh);
      setForm({ name: fresh.name ?? u.name, bitcoinAddress: fresh.bitcoinAddress ?? "", litecoinAddress: fresh.litecoinAddress ?? "" });
    }).catch(() => {});
  }, [router]);


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Name is required."); return; }
    setLoading(true);
    try {
      // PUT /users/profile
      await apiUpdateProfile({ name: form.name, bitcoinAddress: form.bitcoinAddress || undefined, litecoinAddress: form.litecoinAddress || undefined });
      const updated = { ...user!, ...form, bitcoin: form.bitcoinAddress, litecoin: form.litecoinAddress };
      persist(updated);
      setUser(updated);
      toast.success("Profile updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally { setLoading(false); }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwForm.currentPassword) { toast.error("Current password is required."); return; }
    if (!pwForm.newPassword) { toast.error("New password is required."); return; }
    if (pwForm.newPassword.length < 6) { toast.error("New password must be at least 6 characters."); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error("Passwords do not match."); return; }
    setPwLoading(true);
    try {
      await apiChangePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Password change failed.");
    } finally { setPwLoading(false); }
  };

  if (!user) return null;

  const field = (label: string, key: keyof typeof form, ph: string, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">{label}</label>
      <input type={type} placeholder={ph} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--muted)]" />
    </div>
  );

  return (
    <DashLayout variant="admin">
      <CryptoTicker />
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">My Profile</h1>
          <p className="text-[var(--muted)] text-sm mt-0.5">Manage your account settings and security.</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 p-4 sm:p-5 glass rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-2)] flex items-center justify-center text-black text-xl font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-sm text-[var(--muted)] truncate">{user.email}</p>
            <span className="text-xs text-[var(--gold)] font-semibold">{user.isAdmin ? "Administrator" : "Investor"}</span>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 border-b border-[var(--border)]">
          <button onClick={() => setTab("profile")}
            className={`px-4 py-3 font-semibold text-sm transition-colors ${tab === "profile" ? "text-[var(--gold)] border-b-2 border-[var(--gold)]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}>
            <div className="flex items-center gap-2">
              <User size={15} /> Profile Info
            </div>
          </button>
          <button onClick={() => setTab("password")}
            className={`px-4 py-3 font-semibold text-sm transition-colors ${tab === "password" ? "text-[var(--gold)] border-b-2 border-[var(--gold)]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}>
            <div className="flex items-center gap-2">
              <Lock size={15} /> Change Password
            </div>
          </button>
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <>
            {/* Form */}
            <form onSubmit={submit} className="glass rounded-2xl p-4 sm:p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2 text-sm"><User size={15} className="text-[var(--gold)]"/> Personal Info</h2>
              {field("Full Name *", "name", "John Doe")}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">Email</label>
                <input disabled value={user.email} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--muted)] text-sm cursor-not-allowed" />
              </div>
              <div className="pt-3 border-t border-[var(--border)]">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-[var(--gold)]"><Bitcoin size={14}/> Wallet Addresses</h3>
                <div className="space-y-4">
                  {field("Bitcoin (BTC) Address", "bitcoinAddress", "bc1q…")}
                  {field("Litecoin (LTC) Address", "litecoinAddress", "ltc1q…")}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-2)] text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Saving…</> : "Save Changes"}
              </button>
            </form>

            {/* Account info */}
            <div className="glass rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><ShieldCheck size={15} className="text-[var(--gold)]"/> Account Details</h3>
              {[["User ID", user._id ?? `#${user.id}`], ["Role", user.isAdmin ? "Administrator" : "Investor"], ["Email", user.email]].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-sm py-2 border-b border-[var(--border)] last:border-0">
                  <span className="text-[var(--muted)]">{k}</span>
                  <span className="font-mono text-xs bg-[var(--bg-3)] px-2.5 py-1 rounded-lg truncate max-w-[200px]">{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <form onSubmit={submitPassword} className="glass rounded-2xl p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2 text-sm"><Lock size={15} className="text-[var(--gold)]"/> Change Password</h2>
            <p className="text-sm text-[var(--muted)]">Update your password to keep your account secure.</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">Current Password *</label>
              <input type="password" placeholder="Enter current password" 
                value={pwForm.currentPassword} 
                onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--muted)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">New Password *</label>
              <input type="password" placeholder="Enter new password (min 6 characters, including numbers)" 
                value={pwForm.newPassword} 
                onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--muted)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--muted)]">Confirm New Password *</label>
              <input type="password" placeholder="Confirm new password" 
                value={pwForm.confirmPassword} 
                onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--muted)]" />
            </div>
            <button type="submit" disabled={pwLoading} className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-2)] text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {pwLoading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Updating…</> : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </DashLayout>
  );
}
