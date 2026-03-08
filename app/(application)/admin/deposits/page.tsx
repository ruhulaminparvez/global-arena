"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import BottomNavigation from "../_components/BottomNavigation";
import {
  ArrowDownCircle,
  Search,
  X,
  FileImage,
} from "lucide-react";
import Table from "@/components/Table";
import { getDepositsColumns } from "@/columns/admin/deposits";
import {
  getDeposits,
  getDepositById,
  approveDeposit,
  rejectDeposit,
} from "@/api/admin/deposit.manage.api";
import type { Deposit } from "@/api/admin/types/admin.api";

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

export default function DepositManagementPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Deposit | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDeposits(
        statusFilter ? { status: statusFilter } : undefined
      );
      setDeposits(res.results ?? []);
    } catch (e) {
      setError("তালিকা লোড করতে সমস্যা হয়েছে।");
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

  const handleView = async (deposit: Deposit) => {
    setSelectedDeposit(null);
    setDetailLoading(true);
    try {
      const detail = await getDepositById(deposit.id);
      setSelectedDeposit(detail);
    } catch {
      setError("বিবরণ লোড করতে সমস্যা হয়েছে।");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async (deposit: Deposit) => {
    setActionLoading(true);
    try {
      await approveDeposit(deposit.id);
      toast.success("জমা সফলভাবে অনুমোদন করা হয়েছে।");
      setSelectedDeposit(null);
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

  const handleRejectClick = (deposit: Deposit) => {
    setRejectTarget(deposit);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (!reason) return;
    setActionLoading(true);
    try {
      await rejectDeposit(rejectTarget.id, { reason });
      toast.success("জমা সফলভাবে প্রত্যাখ্যান করা হয়েছে।");
      setRejectTarget(null);
      setRejectReason("");
      setSelectedDeposit(null);
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

  const columns = getDepositsColumns({
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
                <ArrowDownCircle className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  জমা ম্যানেজমেন্ট
                </h1>
                <p className="text-slate-300 mt-1">
                  সমস্ত জমা লেনদেন পরিচালনা করুন
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value || "all"}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${statusFilter === opt.value
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg border-transparent"
                : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
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
              placeholder="ব্যবহারকারী বা পরিমাণ দিয়ে অনুসন্ধান করুন..."
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

        {/* Deposits Table */}
        <div className="mb-6">
          {loading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 text-center text-slate-400">
              লোড হচ্ছে...
            </div>
          ) : (
            <Table
              data={filteredDeposits}
              columns={columns}
              emptyMessage="কোন জমা অনুরোধ নেই"
              rowKey={(d) => d.id}
            />
          )}
        </div>
      </div>

      <BottomNavigation />

      {/* Detail modal */}
      {(selectedDeposit !== null || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-accent-950 border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 flex items-center justify-between border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">জমা বিবরণ</h2>
              <button
                type="button"
                onClick={() => setSelectedDeposit(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {detailLoading ? (
                <p className="text-slate-400">লোড হচ্ছে...</p>
              ) : selectedDeposit ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-4 rounded-2xl border border-white/5">
                    <span className="text-slate-400">আইডি</span>
                    <span className="font-medium text-white">{selectedDeposit.id}</span>
                    <span className="text-slate-400">ব্যবহারকারী</span>
                    <span className="font-medium text-white">{selectedDeposit.user}</span>
                    <span className="text-slate-400">পরিমাণ</span>
                    <span className="font-medium text-primary-400">
                      ৳ {parseFloat(selectedDeposit.amount || "0").toLocaleString("bn-BD")}
                    </span>
                    <span className="text-slate-400">স্ট্যাটাস</span>
                    <span className="font-medium text-white">
                      {selectedDeposit.status_display}
                    </span>
                    <span className="text-slate-400">তৈরির তারিখ</span>
                    <span className="font-medium text-white">
                      {formatDate(selectedDeposit.created_at)}
                    </span>
                    <span className="text-slate-400">আপডেট তারিখ</span>
                    <span className="font-medium text-white">
                      {formatDate(selectedDeposit.updated_at)}
                    </span>
                  </div>
                  {selectedDeposit.admin_notes && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <span className="text-slate-400 text-sm">অ্যাডমিন নোট</span>
                      <p className="mt-1 text-white text-sm">
                        {selectedDeposit.admin_notes}
                      </p>
                    </div>
                  )}
                  {selectedDeposit.proof_document && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <span className="text-slate-400 text-sm flex items-center gap-1 mb-2">
                        <FileImage className="w-4 h-4" />
                        প্রুফ ডকুমেন্ট
                      </span>
                      <a
                        href={selectedDeposit.proof_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 hover:underline text-sm inline-block mb-3"
                      >
                        ছবি দেখুন
                      </a>
                      <img
                        src={selectedDeposit.proof_document}
                        alt="Proof"
                        className="rounded-xl border border-white/10 max-h-48 object-contain bg-black/40"
                      />
                    </div>
                  )}
                  {selectedDeposit.status === "PENDING" && (
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleApprove(selectedDeposit)}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        অনুমোদন
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleRejectClick(selectedDeposit)}
                        className="flex-1 py-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 disabled:opacity-50 text-white rounded-xl font-medium transition-all"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-accent-950 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              প্রত্যাখ্যানের কারণ
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              আইডি {rejectTarget.id} – <span className="text-primary-400">৳ {parseFloat(rejectTarget.amount || "0").toLocaleString("bn-BD")}</span>
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="কারণ লিখুন (বাধ্যতামূলক)"
              rows={4}
              className="w-full px-4 py-3 bg-accent-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleRejectSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 shadow-lg shadow-rose-500/20 disabled:opacity-50 text-white rounded-xl font-medium transition-all"
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
