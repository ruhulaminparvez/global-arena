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
    { label: "মোট ব্যবহারকারী", value: String(users.total), icon: Users, color: "from-blue-500 to-blue-700" },
    { label: "মোট ব্যালেন্স", value: `৳ ${wallet.total_balance}`, icon: Wallet, color: "from-green-500 to-green-700" },
    { label: "মোট লকড", value: `৳ ${wallet.total_locked}`, icon: Lock, color: "from-slate-500 to-slate-700" },
    { label: "অ্যাভেইলেবল পুল", value: `৳ ${wallet.available_pool}`, icon: PiggyBank, color: "from-emerald-500 to-emerald-700" },
    { label: "পেন্ডিং ডিপোজিট", value: String(pending_requests.deposits), icon: ArrowDownCircle, color: "from-cyan-500 to-cyan-700" },
    { label: "পেন্ডিং উইথড্রল", value: String(pending_requests.withdrawals), icon: ArrowUpCircle, color: "from-rose-500 to-rose-700" },
    { label: "পেন্ডিং মোট", value: String(pending_requests.total), icon: Clock, color: "from-amber-500 to-amber-700" },
    { label: "সক্রিয় টিকেট সিডিউল", value: String(tickets.active_schedules), icon: LayoutDashboard, color: "from-orange-500 to-orange-700" },
    { label: "টিকেট ক্রয় মোট", value: String(tickets.total_purchases), icon: ShoppingCart, color: "from-violet-500 to-violet-700" },
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        <AdminHeader />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">ড্যাশবোর্ড অ্যান্ড রিপোর্টস</h1>
          <p className="text-gray-600">সিস্টেমের সামগ্রিক পরিসংখ্যান এবং রিপোর্ট</p>
        </div>

        {/* Statistics Cards */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-200 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-16" />
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
