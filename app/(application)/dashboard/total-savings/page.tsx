"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { PiggyBank, List, Wallet, Receipt, Plus, Search, X } from "lucide-react";
import Table from "@/components/Table";
import {
  getSavingsPlanColumns,
  getSavingsTransactionColumns,
} from "@/columns/dashboard/savings";
import {
  createSavingPlan,
  getSavingsPlans,
  getMyPlans,
  getPlanTransactions,
} from "@/api/dashboard/savings.api";
import type { SavingPlan, SavingTransaction } from "@/api/admin/types/admin.api";

const MIN_MONTHLY_AMOUNT = 100;
const MIN_DURATION_MONTHS = 36;

type TabId = "list" | "my_plans";

function planMatchesSearch(plan: SavingPlan, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase().trim();
  return (
    plan.id.toString().includes(lower) ||
    plan.monthly_amount.toLowerCase().includes(lower) ||
    plan.duration_months.toString().includes(lower) ||
    plan.start_date.toLowerCase().includes(lower) ||
    plan.total_saved.toString().includes(lower) ||
    plan.months_remaining.toString().includes(lower) ||
    (plan.is_completed ? "হ্যাঁ" : "না").includes(lower)
  );
}

export default function TotalSavingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create plan form (used in modal)
  const [monthlyAmount, setMonthlyAmount] = useState<string>("");
  const [durationMonths, setDurationMonths] = useState<string>("");
  const [createError, setCreateError] = useState<string>("");
  const [createLoading, setCreateLoading] = useState(false);

  // Search
  const [listSearch, setListSearch] = useState("");
  const [myPlansSearch, setMyPlansSearch] = useState("");

  // List plans (all)
  const [listPlans, setListPlans] = useState<SavingPlan[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // My plans
  const [myPlans, setMyPlans] = useState<SavingPlan[]>([]);
  const [myPlansLoading, setMyPlansLoading] = useState(true);

  // Selected plan & transactions (detail)
  const [selectedPlan, setSelectedPlan] = useState<SavingPlan | null>(null);
  const [transactions, setTransactions] = useState<SavingTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const filteredListPlans = useMemo(
    () => listPlans.filter((p) => planMatchesSearch(p, listSearch)),
    [listPlans, listSearch]
  );
  const filteredMyPlans = useMemo(
    () => myPlans.filter((p) => planMatchesSearch(p, myPlansSearch)),
    [myPlans, myPlansSearch]
  );

  const fetchListPlans = useCallback(async (page = 1) => {
    setListLoading(true);
    try {
      const res = await getSavingsPlans({ page, page_size: 10 });
      setListPlans(res.results ?? []);
    } catch {
      setListPlans([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  const fetchMyPlans = useCallback(async () => {
    setMyPlansLoading(true);
    try {
      const data = await getMyPlans();
      setMyPlans(Array.isArray(data) ? data : []);
    } catch {
      setMyPlans([]);
    } finally {
      setMyPlansLoading(false);
    }
  }, []);

  const fetchPlanTransactions = useCallback(async (planId: number) => {
    setTransactionsLoading(true);
    try {
      const data = await getPlanTransactions(planId);
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListPlans();
  }, [fetchListPlans]);

  useEffect(() => {
    fetchMyPlans();
  }, [fetchMyPlans]);

  useEffect(() => {
    if (selectedPlan) {
      fetchPlanTransactions(selectedPlan.id);
    } else {
      setTransactions([]);
    }
  }, [selectedPlan, fetchPlanTransactions]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    const amount = parseFloat(monthlyAmount);
    const duration = parseInt(durationMonths, 10);

    if (isNaN(amount) || amount < MIN_MONTHLY_AMOUNT) {
      setCreateError(`মাসিক পরিমাণ কমপক্ষে ৳ ${MIN_MONTHLY_AMOUNT} হতে হবে`);
      return;
    }
    if (isNaN(duration) || duration < MIN_DURATION_MONTHS) {
      setCreateError(`মেয়াদ কমপক্ষে ${MIN_DURATION_MONTHS} মাস হতে হবে`);
      return;
    }

    setCreateLoading(true);
    try {
      await createSavingPlan({ monthly_amount: amount, duration_months: duration });
      setMonthlyAmount("");
      setDurationMonths("");
      setShowCreateModal(false);
      fetchListPlans();
      fetchMyPlans();
    } catch (err: unknown) {
      let msg = "প্ল্যান তৈরি ব্যর্থ। আবার চেষ্টা করুন।";
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: Record<string, unknown> } }).response;
        const data = res?.data;
        if (data && typeof data === "object") {
          const parts: string[] = [];
          if (Array.isArray(data.monthly_amount)) parts.push(data.monthly_amount.join(" "));
          if (Array.isArray(data.duration_months)) parts.push(data.duration_months.join(" "));
          if (typeof data.detail === "string") parts.push(data.detail);
          if (parts.length) msg = parts.join(" ");
        }
      } else if (err && typeof err === "object" && "message" in err) {
        msg = String((err as { message: unknown }).message);
      }
      setCreateError(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleMyPlanRowClick = (plan: SavingPlan) => {
    setSelectedPlan((prev) => (prev?.id === plan.id ? null : plan));
  };

  const planColumns = getSavingsPlanColumns();
  const transactionColumns = getSavingsTransactionColumns();

  const tabs: { id: TabId; label: string; icon: typeof List }[] = [
    { id: "list", label: "সঞ্চয় প্ল্যান তালিকা", icon: List },
    { id: "my_plans", label: "আমার প্ল্যান", icon: Wallet },
  ];

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
              <PiggyBank className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                মোট সঞ্চয়
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setCreateError("");
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              নতুন সঞ্চয় প্ল্যান তৈরি
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === tab.id
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* List Saving Plans Tab */}
          {activeTab === "list" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="relative flex gap-2 mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="আইডি, মাসিক পরিমাণ, মেয়াদ বা তারিখ দিয়ে অনুসন্ধান করুন..."
                  className="flex-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {listLoading ? (
                <div className="py-8 text-center text-gray-500">
                  লোড হচ্ছে...
                </div>
              ) : (
                <Table
                  data={filteredListPlans}
                  columns={planColumns}
                  emptyMessage="কোন সঞ্চয় প্ল্যান পাওয়া যায়নি"
                  itemsPerPage={10}
                  className="shadow-none"
                />
              )}
            </motion.div>
          )}

          {/* My Plans Tab */}
          {activeTab === "my_plans" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="relative flex gap-2 mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  value={myPlansSearch}
                  onChange={(e) => setMyPlansSearch(e.target.value)}
                  placeholder="আইডি, মাসিক পরিমাণ, মেয়াদ বা তারিখ দিয়ে অনুসন্ধান করুন..."
                  className="flex-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {myPlansLoading ? (
                <div className="py-8 text-center text-gray-500">
                  লোড হচ্ছে...
                </div>
              ) : (
                <Table
                  data={filteredMyPlans}
                  columns={planColumns}
                  emptyMessage="কোন প্ল্যান পাওয়া যায়নি"
                  onRowClick={handleMyPlanRowClick}
                  rowKey={(row) => row.id}
                  className={selectedPlan ? "rounded-t-xl shadow-none" : "shadow-none"}
                />
              )}

              {/* Plan Transactions Detail */}
              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="p-4 bg-primary-50 border-b border-gray-200 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      প্ল্যান #{selectedPlan.id} – লেনদেন তালিকা
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(null)}
                      className="ml-auto text-sm text-primary-600 hover:text-primary-700"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                  {transactionsLoading ? (
                    <div className="py-8 text-center text-gray-500">
                      লেনদেন লোড হচ্ছে...
                    </div>
                  ) : (
                    <Table
                      data={transactions}
                      columns={transactionColumns}
                      emptyMessage="কোন লেনদেন নেই"
                      className="rounded-t-none border-t-0 shadow-none"
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create Saving Plan Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
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
                  নতুন সঞ্চয় প্ল্যান তৈরি
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                মাসিক কমপক্ষে ৳{MIN_MONTHLY_AMOUNT} এবং মেয়াদ কমপক্ষে {MIN_DURATION_MONTHS} মাস।
              </p>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    মাসিক পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    min={MIN_MONTHLY_AMOUNT}
                    step="0.01"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    মেয়াদ (মাস)
                  </label>
                  <input
                    type="number"
                    min={MIN_DURATION_MONTHS}
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                    placeholder="36"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                {createError && (
                  <p className="text-sm text-red-600">{createError}</p>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {createLoading ? "তৈরি হচ্ছে..." : "প্ল্যান তৈরি"}
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
