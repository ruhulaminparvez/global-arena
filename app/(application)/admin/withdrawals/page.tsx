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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ArrowUpCircle className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  উত্তোলন ম্যানেজমেন্ট
                </h1>
                <p className="text-gray-600 mt-1">
                  সমস্ত উত্তোলন লেনদেন পরিচালনা করুন
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ব্যবহারকারী, পরিমাণ বা ব্যাংক বিবরণ দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Withdrawals Table */}
        <div className="mb-6">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 flex items-center justify-between border-b">
              <h2 className="text-xl font-bold text-gray-900">
                উত্তোলন বিবরণ
              </h2>
              <button
                type="button"
                onClick={() => setSelectedWithdrawal(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {detailLoading ? (
                <p className="text-gray-500">লোড হচ্ছে...</p>
              ) : selectedWithdrawal ? (
                <>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">আইডি</span>
                    <span className="font-medium">
                      {selectedWithdrawal.id}
                    </span>
                    <span className="text-gray-600">ব্যবহারকারী</span>
                    <span className="font-medium">
                      {selectedWithdrawal.user}
                    </span>
                    <span className="text-gray-600">পরিমাণ</span>
                    <span className="font-medium">
                      ৳{" "}
                      {parseFloat(
                        selectedWithdrawal.amount || "0"
                      ).toLocaleString("bn-BD")}
                    </span>
                    <span className="text-gray-600">স্ট্যাটাস</span>
                    <span className="font-medium">
                      {selectedWithdrawal.status_display}
                    </span>
                    <span className="text-gray-600">তৈরির তারিখ</span>
                    <span className="font-medium">
                      {formatDate(selectedWithdrawal.created_at)}
                    </span>
                    <span className="text-gray-600">আপডেট তারিখ</span>
                    <span className="font-medium">
                      {formatDate(selectedWithdrawal.updated_at)}
                    </span>
                  </div>
                  {selectedWithdrawal.bank_details && (
                    <div>
                      <span className="text-gray-600 text-sm">
                        ব্যাংক বিবরণ
                      </span>
                      <pre className="mt-1 p-2 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap font-sans">
                        {selectedWithdrawal.bank_details}
                      </pre>
                    </div>
                  )}
                  {selectedWithdrawal.admin_notes && (
                    <div>
                      <span className="text-gray-600 text-sm">
                        অ্যাডমিন নোট
                      </span>
                      <p className="mt-1 p-2 bg-gray-50 rounded-lg text-sm">
                        {selectedWithdrawal.admin_notes}
                      </p>
                    </div>
                  )}
                  {selectedWithdrawal.status === "PENDING" && (
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleApprove(selectedWithdrawal)
                        }
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium"
                      >
                        অনুমোদন
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleRejectClick(selectedWithdrawal)
                        }
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              প্রত্যাখ্যানের কারণ
            </h2>
            <p className="text-sm text-gray-600 mb-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleRejectSubmit}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium"
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
