"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { Users, Search, UserPlus, Receipt, CheckCircle, XCircle, Clock } from "lucide-react";
import Table from "@/components/Table";
import { Button } from "@/components/button";
import { getUsersColumns } from "@/columns/admin/users";
import { UserDetailModal } from "./_components/UserDetailModal";
import { CreateSupportUserModal } from "./_components/CreateSupportUserModal";
import {
  getUsers,
  getFeePayments,
  approveFeePayment,
  rejectFeePayment,
} from "@/api/admin/users.manage.api";
import type { User, FeePayment, FeePaymentStatus } from "@/api/admin/types/admin.api";
import toast from "react-hot-toast";

type TabId = "users" | "fee-management";

function filterUsers(list: User[], search: string): User[] {
  const sorted = [...list].sort((a, b) => b.id - a.id);
  if (!search.trim()) return sorted;
  const q = search.trim().toLowerCase();
  return sorted.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.first_name && u.first_name.toLowerCase().includes(q)) ||
      (u.last_name && u.last_name.toLowerCase().includes(q)) ||
      `${(u.first_name || "").toLowerCase()} ${(u.last_name || "").toLowerCase()}`.includes(q) ||
      `${(u.last_name || "").toLowerCase()} ${(u.first_name || "").toLowerCase()}`.includes(q)
  );
}

const STATUS_OPTIONS: { value: FeePaymentStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "সব" },
  { value: "PENDING", label: "অপেক্ষমান" },
  { value: "APPROVED", label: "অনুমোদিত" },
  { value: "REJECTED", label: "প্রত্যাখ্যাত" },
];

function StatusBadge({ status, display }: { status: FeePaymentStatus; display: string }) {
  const styles: Record<FeePaymentStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {display}
    </span>
  );
}

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>("users");

  // Users tab state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fee management tab state
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeStatusFilter, setFeeStatusFilter] = useState<FeePaymentStatus | "ALL">("ALL");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers();
      setUsers(res.results ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে";
      setError(message);
      toast.error(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeePayments = useCallback(async () => {
    setFeeLoading(true);
    setFeeError(null);
    try {
      const params = feeStatusFilter !== "ALL" ? { status: feeStatusFilter } : undefined;
      const res = await getFeePayments(params);
      setFeePayments(res.results ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে";
      setFeeError(message);
      toast.error(message);
      setFeePayments([]);
    } finally {
      setFeeLoading(false);
    }
  }, [feeStatusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeTab === "fee-management") {
      fetchFeePayments();
    }
  }, [activeTab, fetchFeePayments]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await approveFeePayment(id);
      toast.success("পেমেন্ট সফলভাবে অনুমোদন করা হয়েছে");
      await fetchFeePayments();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "অনুমোদন করতে সমস্যা হয়েছে";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await rejectFeePayment(id);
      toast.success("পেমেন্ট সফলভাবে প্রত্যাখ্যান করা হয়েছে");
      await fetchFeePayments();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "প্রত্যাখ্যান করতে সমস্যা হয়েছে";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = useMemo(
    () => filterUsers(users, searchQuery),
    [users, searchQuery]
  );

  const columns = useMemo(
    () =>
      getUsersColumns({
        onViewDetail: (user) => setSelectedUser(user),
        onEdit: (user) => setSelectedUser(user),
      }),
    []
  );

  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: "users", label: "ইউজার তথ্য", icon: Users },
    { id: "fee-management", label: "রেজিস্ট্রেশন ফি ম্যানেজমেন্ট", icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ইউজার ম্যানেজমেন্ট
                </h1>
                <p className="text-gray-600 mt-1">
                  সমস্ত ব্যবহারকারী পরিচালনা করুন
                </p>
              </div>
            </div>
            {activeTab === "users" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  icon={UserPlus}
                  onClick={() => setCreateModalOpen(true)}
                >
                  নতুন সাপোর্ট ব্যবহারকারী
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${isActive
                    ? "bg-primary-600 text-white border-b-2 border-primary-600"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-b-2 border-transparent"
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab: User Information */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, ইমেইল বা ইউজারনেম দিয়ে অনুসন্ধান করুন..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
                  লোড হচ্ছে...
                </div>
              ) : (
                <Table
                  data={filteredUsers}
                  columns={columns}
                  emptyMessage="কোন ব্যবহারকারী পাওয়া যায়নি"
                  itemsPerPage={10}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab: Registration Fee Management */}
        {activeTab === "fee-management" && (
          <div className="space-y-6">
            {/* Status Filter */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700">স্ট্যাটাস ফিল্টার:</span>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFeeStatusFilter(opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${feeStatusFilter === opt.value
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fee Payments Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {feeError && (
                <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {feeError}
                </div>
              )}
              {feeLoading ? (
                <div className="p-12 text-center text-gray-500">
                  লোড হচ্ছে...
                </div>
              ) : feePayments.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  কোন রেজিস্ট্রেশন ফি পেমেন্ট পাওয়া যায়নি
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ইউজার</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">পরিমাণ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">লেনদেন আইডি</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">পেমেন্ট পদ্ধতি</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাডমিন নোট</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {feePayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-500">{payment.id}</td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{payment.user_name}</td>
                          <td className="px-4 py-4 text-sm text-gray-700">৳{payment.amount}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 font-mono">{payment.transaction_id}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{payment.payment_method}</td>
                          <td className="px-4 py-4">
                            <StatusBadge status={payment.status} display={payment.status_display} />
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-[160px] truncate">
                            {payment.admin_notes ?? "—"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {new Date(payment.created_at).toLocaleDateString("bn-BD")}
                          </td>
                          <td className="px-4 py-4">
                            {payment.status === "PENDING" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={actionLoading === payment.id}
                                  onClick={() => handleApprove(payment.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  অনুমোদন
                                </button>
                                <button
                                  type="button"
                                  disabled={actionLoading === payment.id}
                                  onClick={() => handleReject(payment.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  প্রত্যাখ্যান
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                {payment.status_display}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />

      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdated={() => {
              fetchUsers();
              setSelectedUser(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createModalOpen && (
          <CreateSupportUserModal
            onClose={() => setCreateModalOpen(false)}
            onCreated={() => {
              fetchUsers();
              setCreateModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
