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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ArrowDownCircle className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  জমা ম্যানেজমেন্ট
                </h1>
                <p className="text-gray-600 mt-1">
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === opt.value
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
              placeholder="ব্যবহারকারী বা পরিমাণ দিয়ে অনুসন্ধান করুন..."
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

        {/* Deposits Table */}
        <div className="mb-6">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 flex items-center justify-between border-b">
              <h2 className="text-xl font-bold text-gray-900">জমা বিবরণ</h2>
              <button
                type="button"
                onClick={() => setSelectedDeposit(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {detailLoading ? (
                <p className="text-gray-500">লোড হচ্ছে...</p>
              ) : selectedDeposit ? (
                <>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">আইডি</span>
                    <span className="font-medium">{selectedDeposit.id}</span>
                    <span className="text-gray-600">ব্যবহারকারী</span>
                    <span className="font-medium">{selectedDeposit.user}</span>
                    <span className="text-gray-600">পরিমাণ</span>
                    <span className="font-medium">
                      ৳ {parseFloat(selectedDeposit.amount || "0").toLocaleString("bn-BD")}
                    </span>
                    <span className="text-gray-600">স্ট্যাটাস</span>
                    <span className="font-medium">
                      {selectedDeposit.status_display}
                    </span>
                    <span className="text-gray-600">তৈরির তারিখ</span>
                    <span className="font-medium">
                      {formatDate(selectedDeposit.created_at)}
                    </span>
                    <span className="text-gray-600">আপডেট তারিখ</span>
                    <span className="font-medium">
                      {formatDate(selectedDeposit.updated_at)}
                    </span>
                  </div>
                  {selectedDeposit.admin_notes && (
                    <div>
                      <span className="text-gray-600 text-sm">অ্যাডমিন নোট</span>
                      <p className="mt-1 p-2 bg-gray-50 rounded-lg text-sm">
                        {selectedDeposit.admin_notes}
                      </p>
                    </div>
                  )}
                  {selectedDeposit.proof_document && (
                    <div>
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <FileImage className="w-4 h-4" />
                        প্রুফ ডকুমেন্ট
                      </span>
                      <a
                        href={selectedDeposit.proof_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-primary-600 hover:underline text-sm"
                      >
                        ছবি দেখুন
                      </a>
                      <img
                        src={selectedDeposit.proof_document}
                        alt="Proof"
                        className="mt-2 rounded-lg border max-h-48 object-contain"
                      />
                    </div>
                  )}
                  {selectedDeposit.status === "PENDING" && (
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleApprove(selectedDeposit)}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium"
                      >
                        অনুমোদন
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleRejectClick(selectedDeposit)}
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
              {parseFloat(rejectTarget.amount || "0").toLocaleString("bn-BD")}
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
