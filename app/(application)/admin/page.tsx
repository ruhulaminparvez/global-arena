"use client";

import { useState, useEffect, useCallback } from "react";
import AdminHeader from "./_components/AdminHeader";
import AdminStatsCards from "./_components/AdminStatsCards";
import BottomNavigation from "./_components/BottomNavigation";
import {
  LayoutDashboard,
  Clock,
  Users,
  Wallet,
  Lock,
  PiggyBank,
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
} from "lucide-react";
import { getDashboardSummary } from "@/api/admin/dashboard.manage.api";
import type { DashboardSummary } from "@/api/admin/types/admin.api";

function buildStatsFromSummary(summary: DashboardSummary) {
  const { users, wallet, pending_requests, tickets } = summary;
  return [
    { label: "মোট ব্যবহারকারী", value: String(users.total), icon: Users, color: "from-blue-500 to-indigo-600" },
    { label: "মোট ব্যালেন্স", value: `৳ ${wallet.total_balance}`, icon: Wallet, color: "from-emerald-400 to-emerald-600" },
    { label: "লকড (উইথড্রল)", value: `৳ ${wallet.withdrawal_locked}`, icon: Lock, color: "from-slate-400 to-slate-600" },
    { label: "লকড (সেভিংস)", value: `৳ ${wallet.savings_locked}`, icon: PiggyBank, color: "from-fuchsia-400 to-fuchsia-600" },
    { label: "অ্যাভেইলেবল পুল", value: `৳ ${wallet.available_pool}`, icon: PiggyBank, color: "from-teal-400 to-teal-600" },
    { label: "পেন্ডিং ডিপোজিট", value: String(pending_requests.deposits), icon: ArrowDownCircle, color: "from-cyan-400 to-cyan-600" },
    { label: "পেন্ডিং উইথড্রল", value: String(pending_requests.withdrawals), icon: ArrowUpCircle, color: "from-rose-400 to-rose-600" },
    { label: "পেন্ডিং মোট", value: String(pending_requests.total), icon: Clock, color: "from-amber-400 to-amber-600" },
    { label: "সক্রিয় টিকেট সিডিউল", value: String(tickets.active_schedules), icon: LayoutDashboard, color: "from-orange-400 to-orange-600" },
    { label: "টিকেট ক্রয় মোট", value: String(tickets.total_purchases), icon: ShoppingCart, color: "from-violet-400 to-violet-600" },
  ];
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে";
      setError(message);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const stats = summary ? buildStatsFromSummary(summary) : [];

  return (
    <div className="min-h-screen bg-accent-950 overflow-x-hidden relative text-white font-sans">
      {/* Premium Background Graphics */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-cyan-900/20 mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        <AdminHeader />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">ড্যাশবোর্ড অ্যান্ড রিপোর্টস</h1>
          <p className="text-accent-300 text-lg">সিস্টেমের সামগ্রিক পরিসংখ্যান এবং রিপোর্ট</p>
        </div>

        {/* Statistics Cards */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-200 backdrop-blur-md">
            {error}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 mb-5" />
                <div className="h-4 bg-white/10 rounded w-24 mb-3" />
                <div className="h-8 bg-white/10 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <AdminStatsCards stats={stats} />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
