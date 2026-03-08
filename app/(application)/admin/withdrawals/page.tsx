"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import BottomNavigation from "../_components/BottomNavigation";
import { ArrowUpCircle, Search, X } from "lucide-react";
import Table from "@/components/Table";
import { getWithdrawalsColumns } from "@/columns/admin/withdrawals";
import {
  getWithdrawals,
  getWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
} from "@/api/admin/withdraw.manage.api";
import type { Withdrawal } from "@/api/admin/types/admin.api";

type StatusFilter = "" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "সব" },
  { value: "PENDING", label: "বিবেচনাধীন" },
  { value: "APPROVED", label: "অনুমোদিত" },
  { value: "REJECTED", label: "প্রত্যাখ্যান" },
];

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function WithdrawalManagementPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Withdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleView = async (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(null);
    setDetailLoading(true);
    try {
      const detail = await getWithdrawalById(withdrawal.id);
      setSelectedWithdrawal(detail);
    } catch {
      setError("বিবরণ লোড করতে সমস্যা হয়েছে।");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async (withdrawal: Withdrawal) => {
    setActionLoading(true);
    try {
      await approveWithdrawal(withdrawal.id);
      toast.success("উত্তোলন সফলভাবে অনুমোদন করা হয়েছে।");
      setSelectedWithdrawal(null);
      await fetchList();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "অনুমোদন করতে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (withdrawal: Withdrawal) => {
    setRejectTarget(withdrawal);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (!reason) return;
    setActionLoading(true);
    try {
      await rejectWithdrawal(rejectTarget.id, { reason });
      toast.success("উত্তোলন সফলভাবে প্রত্যাখ্যান করা হয়েছে।");
      setRejectTarget(null);
      setRejectReason("");
      setSelectedWithdrawal(null);
      await fetchList();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "প্রত্যাখ্যান করতে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = getWithdrawalsColumns({
    onView: handleView,
    onApprove: handleApprove,
    onReject: handleRejectClick,
  });

  return (
    <div className="min-h-screen bg-accent-950 overflow-x-hidden relative text-white font-sans">
      {/* Premium Background Graphics */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-cyan-900/20 mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-50"></div>
          <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-500/20 rounded-2xl border border-primary-500/30">
                <ArrowUpCircle className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  উত্তোলন ম্যানেজমেন্ট
                </h1>
                <p className="text-slate-300 mt-1">
                  সমস্ত উত্তোলন লেনদেন পরিচালনা করুন
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status filter */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden p-1 flex flex-wrap gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value || "all"}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${statusFilter === opt.value
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ব্যবহারকারী, পরিমাণ বা ব্যাংক বিবরণ দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 bg-accent-900/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Withdrawals Table */}
        <div className="mb-6">
          {loading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-12 text-center text-slate-400">
              লোড হচ্ছে...
            </div>
          ) : (
            <Table
              data={filteredWithdrawals}
              columns={columns}
              emptyMessage="কোন উত্তোলন অনুরোধ নেই"
              rowKey={(w) => w.id}
            />
          )}
        </div>
      </div>

      <BottomNavigation />

      {/* Detail modal */}
      {(selectedWithdrawal !== null || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-accent-950 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col backdrop-blur-xl">
            <div className="shrink-0 bg-gradient-to-r from-primary-900/50 to-indigo-900/50 p-6 flex items-center justify-between border-b border-white/10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                উত্তোলন বিবরণ
              </h2>
              <button
                type="button"
                onClick={() => setSelectedWithdrawal(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {detailLoading ? (
                <p className="text-gray-500">লোড হচ্ছে...</p>
              ) : selectedWithdrawal ? (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <span className="text-slate-400 uppercase tracking-wider text-xs font-bold pt-1">আইডি</span>
                    <span className="text-white font-medium">
                      {selectedWithdrawal.id}
                    </span>
                    <span className="text-slate-400 uppercase tracking-wider text-xs font-bold pt-1">ব্যবহারকারী</span>
                    <span className="text-white font-medium">
                      {selectedWithdrawal.user}
                    </span>
                    <span className="text-slate-400 uppercase tracking-wider text-xs font-bold pt-1">পরিমাণ</span>
                    <span className="text-white font-medium">
                      ৳{" "}
                      {parseFloat(
                        selectedWithdrawal.amount || "0"
                      ).toLocaleString("bn-BD")}
                    </span>
                    <span className="text-slate-400 uppercase tracking-wider text-xs font-bold pt-1">স্ট্যাটাস</span>
                    <span className="text-white font-medium">
                      {selectedWithdrawal.status_display}
                    </span>
                    <span className="text-slate-400 uppercase tracking-wider text-xs font-bold pt-1">তৈরির তারিখ</span>
                    <span className="text-white font-medium">
                      {formatDate(selectedWithdrawal.created_at)}
                    </span>
                    <span className="text-slate-400 uppercase tracking-wider text-xs font-bold pt-1">আপডেট তারিখ</span>
                    <span className="text-white font-medium">
                      {formatDate(selectedWithdrawal.updated_at)}
                    </span>
                  </div>
                  {selectedWithdrawal.bank_details && (
                    <div className="pt-2">
                      <span className="text-slate-300 font-medium text-sm">
                        ব্যাংক বিবরণ
                      </span>
                      <pre className="mt-2 p-3 bg-black/30 border border-white/10 rounded-xl text-slate-300 text-sm whitespace-pre-wrap font-sans">
                        {selectedWithdrawal.bank_details}
                      </pre>
                    </div>
                  )}
                  {selectedWithdrawal.admin_notes && (
                    <div className="pt-2">
                      <span className="text-slate-300 font-medium text-sm">
                        অ্যাডমিন নোট
                      </span>
                      <p className="mt-2 p-3 bg-black/30 border border-white/10 rounded-xl text-slate-300 text-sm">
                        {selectedWithdrawal.admin_notes}
                      </p>
                    </div>
                  )}
                  {selectedWithdrawal.status === "PENDING" && (
                    <div className="flex gap-3 pt-6 border-t border-white/10">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleApprove(selectedWithdrawal)
                        }
                        className="flex-1 py-3 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 disabled:opacity-50 rounded-xl font-medium transition-all"
                      >
                        অনুমোদন
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleRejectClick(selectedWithdrawal)
                        }
                        className="flex-1 py-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 disabled:opacity-50 rounded-xl font-medium transition-all"
                      >
                        প্রত্যাখ্যান
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-accent-950 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl max-w-md w-full p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-2">
              প্রত্যাখ্যানের কারণ
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              আইডি {rejectTarget.id} – ৳{" "}
              {parseFloat(rejectTarget.amount || "0").toLocaleString(
                "bn-BD"
              )}
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="কারণ লিখুন (বাধ্যতামূলক)"
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-sans"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
                className="px-6 py-2.5 border border-white/10 hover:bg-white/5 text-slate-300 rounded-xl font-medium transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleRejectSubmit}
                className="px-6 py-2.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 disabled:opacity-50 rounded-xl font-medium transition-all"
              >
                প্রত্যাখ্যান
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
