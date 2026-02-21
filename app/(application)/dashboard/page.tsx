"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import UserDetail from "./_components/UserDetail";
import MonthlySavingsGraph from "./_components/MonthlySavingsGraph";
import BottomNavigation from "./_components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardSummary, getTicketAnalytics } from "@/api/dashboard/dashboard.api";
import type {
  DashboardSummary,
  TicketAnalyticsItem,
} from "@/api/dashboard/types/dashboard.api";
import {
  Users,
  Wallet,
  Lock,
  PiggyBank,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  LayoutDashboard,
  ShoppingCart,
  Ticket,
  BarChart3,
} from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { extractNumericValue, formatValue } from "@/helpers/format.helpers";
import toast from "react-hot-toast";

const ALLOWED_ROLES = ["SUPPORT"];

function buildSummaryStats(summary: DashboardSummary) {
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

function SummaryStatCard({
  label,
  value,
  icon: Icon,
  color,
  index,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  color: string;
  index: number;
}) {
  const numericValue = extractNumericValue(value);
  const animatedValue = useCounterAnimation(numericValue, 3000 + index * 200);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
    >
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-gray-600 text-xs mb-1">{label}</h3>
      <p className="text-lg font-bold text-gray-900">
        {formatValue(value, animatedValue)}
      </p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const canViewAdminStats =
    !!profile?.role && ALLOWED_ROLES.includes(profile.role.toUpperCase());

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ticketAnalytics, setTicketAnalytics] = useState<TicketAnalyticsItem[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "সারসংক্ষেপ লোড করতে ব্যর্থ");
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const fetchTicketAnalytics = useCallback(async () => {
    setTicketsLoading(true);
    try {
      const data = await getTicketAnalytics();
      setTicketAnalytics(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "টিকেট ডেটা লোড করতে ব্যর্থ");
      setTicketAnalytics([]);
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canViewAdminStats) {
      fetchSummary();
      fetchTicketAnalytics();
    }
  }, [canViewAdminStats, fetchSummary, fetchTicketAnalytics]);

  const summaryStats = summary ? buildSummaryStats(summary) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        <UserDetail />

        {/* Summary Stats - SUPPORT / ADMIN only */}
        {canViewAdminStats && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                সারসংক্ষেপ পরিসংখ্যান
              </h2>
              {summaryLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-12" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {summaryStats.map((stat, index) => (
                    <SummaryStatCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Ticket Analytics - SUPPORT / ADMIN only */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary-600" />
                টিকেট অ্যানালিটিক্স
              </h2>
              {ticketsLoading ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
                  টিকেট ডেটা লোড হচ্ছে...
                </div>
              ) : ticketAnalytics.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
                  কোন টিকেট ডেটা নেই
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticketAnalytics.map((ticket, index) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 mb-3 truncate" title={ticket.title}>
                        {ticket.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">মূল্য</span>
                          <p className="font-medium text-gray-900">
                            ৳ {ticket.price.toLocaleString("bn-BD")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">সর্বোচ্চ টিকেট</span>
                          <p className="font-medium text-gray-900">{ticket.max_tickets}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">ক্রয় সংখ্যা</span>
                          <p className="font-medium text-gray-900">{ticket.purchase_count}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">মোট আয়</span>
                          <p className="font-medium text-gray-900">
                            {ticket.total_revenue != null
                              ? `৳ ${ticket.total_revenue.toLocaleString("bn-BD")}`
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {ticket.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.is_confirmed ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {ticket.is_confirmed ? "নিশ্চিত" : "অনিশ্চিত"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mb-6">
          <MonthlySavingsGraph />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
