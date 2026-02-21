"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { ArrowDownCircle, Search, Plus, X, Upload } from "lucide-react";
import Table from "@/components/Table";
import { getDepositColumns } from "@/columns/dashboard/deposit";
import {
  createDepositRequest,
  getDeposits,
  approveDeposit,
} from "@/api/dashboard/deposit.api";
import type { Deposit } from "@/api/dashboard/types/dashboard.api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

type StatusFilter = "" | "PENDING" | "APPROVED" | "REJECTED";

function getApiError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: unknown } }).response?.data;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.detail === "string") return d.detail;
      const first = Object.values(d)[0];
      if (Array.isArray(first) && typeof first[0] === "string") return first[0];
      if (typeof first === "string") return first;
    }
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

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

export default function DepositPage() {
  const { profile } = useAuth();
  const isSupport =
    profile &&
    (profile.role === "SUPPORT" || String(profile.role).toLowerCase() === "support");

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    proof_document: null as File | null,
  });

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getDeposits(
        statusFilter ? { status: statusFilter } : undefined
      );
      setDeposits(res.results ?? []);
    } catch (err) {
      toast.error(getApiError(err, "তালিকা লোড করতে সমস্যা হয়েছে।"));
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [statusFilter]);

  const filteredDeposits = useMemo(() => {
    if (!searchQuery.trim()) return deposits;
    const q = searchQuery.trim().toLowerCase();
    return deposits.filter(
      (d) =>
        d.user?.toLowerCase().includes(q) ||
        (d.amount && d.amount.toLowerCase().includes(q))
    );
  }, [deposits, searchQuery]);

  const totalAmount = useMemo(
    () =>
      filteredDeposits
        .filter((d) => d.status === "APPROVED")
        .reduce((sum, d) => sum + parseFloat(d.amount || "0"), 0),
    [filteredDeposits]
  );

  const approvedCount = useMemo(
    () => filteredDeposits.filter((d) => d.status === "APPROVED").length,
    [filteredDeposits]
  );

  const rejectedCount = useMemo(
    () => filteredDeposits.filter((d) => d.status === "REJECTED").length,
    [filteredDeposits]
  );

  const pendingCount = useMemo(
    () => filteredDeposits.filter((d) => d.status === "PENDING").length,
    [filteredDeposits]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = formData.amount.trim();
    const file = formData.proof_document;
    if (!amount || !file) return;
    setSubmitLoading(true);
    try {
      await createDepositRequest(amount, file);
      setFormData({ amount: "", proof_document: null });
      setShowDepositModal(false);
      await fetchList();
      toast.success("জমা অনুরোধ সফলভাবে জমা হয়েছে।");
    } catch (err) {
      toast.error(getApiError(err, "জমা অনুরোধ জমা দিতে সমস্যা হয়েছে।"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleApprove = async (deposit: Deposit) => {
    setActionLoading(true);
    try {
      await approveDeposit(deposit.id);
      await fetchList();
      toast.success("জমা অনুমোদন সফল হয়েছে।");
    } catch (err) {
      toast.error(getApiError(err, "অনুমোদন করতে সমস্যা হয়েছে।"));
    } finally {
      setActionLoading(false);
    }
  };

  const columns = getDepositColumns({
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
              <ArrowDownCircle className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                জমা
              </h1>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDepositModal(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              নতুন জমা
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
                placeholder="ব্যবহারকারী বা পরিমাণ দিয়ে অনুসন্ধান করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-600">মোট জমা</p>
              <p className="text-xl font-bold text-blue-600">
                ৳ {totalAmount.toLocaleString("bn-BD")}
              </p>
            </div>
            <div className="bg-cyan-50 rounded-lg px-4 py-2">
              <p className="text-sm text-cyan-600">মোট সংখ্যা</p>
              <p className="text-xl font-bold text-cyan-600">
                {filteredDeposits.length}
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

        {/* Deposits Table */}
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
              data={filteredDeposits}
              columns={columns}
              emptyMessage="কোন জমা পাওয়া যায়নি"
              rowKey={(d) => d.id}
            />
          )}
        </motion.div>
      </div>

      {/* Deposit Modal - Create request */}
      <AnimatePresence>
        {showDepositModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowDepositModal(false)}
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
                  নতুন জমা অনুরোধ
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিকাশ/নগদ
                  </label>
                  <input
                    type="text"
                    value="01622260086"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পরিমাণ (৳)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
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
                    প্রুফ ডকুমেন্ট (ছবি/ফাইল)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formData.proof_document
                          ? formData.proof_document.name
                          : "ফাইল নির্বাচন করুন"}
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        required
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setFormData({
                            ...formData,
                            proof_document: file ?? null,
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {submitLoading ? "জমা হচ্ছে..." : "জমা করুন"}
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
