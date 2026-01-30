"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { ArrowUpCircle, Search, Plus, X } from "lucide-react";
import Table from "@/components/Table";
import { getWithdrawalColumns } from "@/columns/dashboard/withdrawal";
import {
  createWithdrawalRequest,
  getWithdrawals,
  approveWithdrawal,
} from "@/api/dashboard/withdraw.api";
import type { Withdrawal } from "@/api/dashboard/types/dashboard.api";
import { useAuth } from "@/contexts/AuthContext";

type StatusFilter = "" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "সব" },
  { value: "PENDING", label: "বিবেচনাধীন" },
  { value: "APPROVED", label: "অনুমোদিত" },
  { value: "REJECTED", label: "প্রত্যাখ্যান" },
];

function formatDateDisplay(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function WithdrawalPage() {
  const { profile } = useAuth();
  const isSupport =
    profile &&
    (profile.role === "SUPPORT" || String(profile.role).toLowerCase() === "support");

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    bank_details: "",
  });

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWithdrawals(
        statusFilter ? { status: statusFilter } : undefined
      );
      setWithdrawals(res.results ?? []);
    } catch {
      setError("তালিকা লোড করতে সমস্যা হয়েছে।");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [statusFilter]);

  const filteredWithdrawals = useMemo(() => {
    if (!searchQuery.trim()) return withdrawals;
    const q = searchQuery.trim().toLowerCase();
    return withdrawals.filter(
      (w) =>
        w.user?.toLowerCase().includes(q) ||
        (w.amount && w.amount.toLowerCase().includes(q)) ||
        (w.bank_details && w.bank_details.toLowerCase().includes(q))
    );
  }, [withdrawals, searchQuery]);

  const totalAmount = useMemo(
    () =>
      filteredWithdrawals
        .filter((w) => w.status === "APPROVED")
        .reduce((sum, w) => sum + parseFloat(w.amount || "0"), 0),
    [filteredWithdrawals]
  );

  const approvedCount = useMemo(
    () => filteredWithdrawals.filter((w) => w.status === "APPROVED").length,
    [filteredWithdrawals]
  );

  const rejectedCount = useMemo(
    () => filteredWithdrawals.filter((w) => w.status === "REJECTED").length,
    [filteredWithdrawals]
  );

  const pendingCount = useMemo(
    () => filteredWithdrawals.filter((w) => w.status === "PENDING").length,
    [filteredWithdrawals]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount.trim());
    const bank_details = formData.bank_details.trim();
    if (Number.isNaN(amount) || amount <= 0 || !bank_details) return;
    setSubmitLoading(true);
    setError(null);
    try {
      await createWithdrawalRequest({ amount, bank_details });
      setFormData({ amount: "", bank_details: "" });
      setShowWithdrawalModal(false);
      await fetchList();
    } catch {
      setError("উত্তোলন অনুরোধ জমা দিতে সমস্যা হয়েছে।");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleApprove = async (withdrawal: Withdrawal) => {
    setActionLoading(true);
    setError(null);
    try {
      await approveWithdrawal(withdrawal.id);
      await fetchList();
    } catch {
      setError("অনুমোদন করতে সমস্যা হয়েছে।");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = getWithdrawalColumns({
    formatDate: formatDateDisplay,
    onApprove: handleApprove,
    isSupport: !!isSupport,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <ArrowUpCircle className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                উত্তোলন
              </h1>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWithdrawalModal(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              নতুন উত্তোলন
            </motion.button>
          </div>

          {/* Status filter */}
          <div className="mb-4 flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value || "all"}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === opt.value
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ব্যবহারকারী, পরিমাণ বা ব্যাংক বিবরণ দিয়ে অনুসন্ধান করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Summary */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-primary-50 rounded-lg px-4 py-2">
              <p className="text-sm text-primary-600">মোট উত্তোলন</p>
              <p className="text-xl font-bold text-primary-600">
                ৳ {totalAmount.toLocaleString("bn-BD")}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-600">মোট সংখ্যা</p>
              <p className="text-xl font-bold text-blue-600">
                {filteredWithdrawals.length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg px-4 py-2">
              <p className="text-sm text-green-600">অনুমোদিত</p>
              <p className="text-xl font-bold text-green-600">
                {approvedCount}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg px-4 py-2">
              <p className="text-sm text-red-600">প্রত্যাখ্যান</p>
              <p className="text-xl font-bold text-red-600">
                {rejectedCount}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg px-4 py-2">
              <p className="text-sm text-orange-600">পেন্ডিং</p>
              <p className="text-xl font-bold text-orange-600">
                {pendingCount}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Withdrawals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
              লোড হচ্ছে...
            </div>
          ) : (
            <Table
              data={filteredWithdrawals}
              columns={columns}
              emptyMessage="কোন উত্তোলন পাওয়া যায়নি"
              rowKey={(w) => w.id}
            />
          )}
        </motion.div>
      </div>

      {/* Withdrawal Modal - Create request */}
      <AnimatePresence>
        {showWithdrawalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowWithdrawalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  নতুন উত্তোলন অনুরোধ
                </h3>
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="পরিমাণ লিখুন"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ব্যাংক বিবরণ
                  </label>
                  <textarea
                    required
                    value={formData.bank_details}
                    onChange={(e) =>
                      setFormData({ ...formData, bank_details: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={'যেমন:\nব্যাংক: ABC Bank\nঅ্যাকাউন্ট: 123456789\nনাম: John Doe'}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    ব্যাংক নাম, অ্যাকাউন্ট নম্বর ও নাম লিখুন
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {submitLoading ? "জমা হচ্ছে..." : "উত্তোলন করুন"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </div>
  );
}
