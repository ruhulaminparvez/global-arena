"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { PiggyBank, Wallet, Receipt, Search } from "lucide-react";
import Table from "@/components/Table";
import {
  getSavingsPlanColumns,
  getSavingsTransactionColumns,
} from "@/columns/dashboard/savings";
import {
  getMyPlans,
  getPlanTransactions,
} from "@/api/dashboard/savings.api";
import type { SavingPlan, SavingTransaction } from "@/api/admin/types/admin.api";
import toast from "react-hot-toast";

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
  const [myPlansSearch, setMyPlansSearch] = useState("");

  // My plans
  const [myPlans, setMyPlans] = useState<SavingPlan[]>([]);
  const [myPlansLoading, setMyPlansLoading] = useState(true);

  // Selected plan & transactions (detail)
  const [selectedPlan, setSelectedPlan] = useState<SavingPlan | null>(null);
  const [transactions, setTransactions] = useState<SavingTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const filteredMyPlans = useMemo(
    () => myPlans.filter((p) => planMatchesSearch(p, myPlansSearch)),
    [myPlans, myPlansSearch]
  );

  const fetchMyPlans = useCallback(async () => {
    setMyPlansLoading(true);
    try {
      const data = await getMyPlans();
      setMyPlans(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "প্ল্যান লোড করতে ব্যর্থ");
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
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "লেনদেন লোড করতে ব্যর্থ");
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

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

  const handleMyPlanRowClick = (plan: SavingPlan) => {
    setSelectedPlan((prev) => (prev?.id === plan.id ? null : plan));
  };

  const planColumns = getSavingsPlanColumns();
  const transactionColumns = getSavingsTransactionColumns();

  return (
    <div className="min-h-screen bg-accent-950 overflow-x-hidden relative">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <PiggyBank className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              মোট সঞ্চয়
            </h1>
          </div>

          {/* Tab Header */}
          <div className="flex gap-2 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-t-xl font-medium bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25">
              <Wallet className="w-4 h-4" />
              আমার প্ল্যান
            </div>
          </div>

          {/* My Plans */}
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
                className="flex-1 pl-10 pr-4 py-3 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-slate-500 backdrop-blur-sm transition-all"
              />
            </div>
            {myPlansLoading ? (
              <div className="py-8 text-center text-slate-400">
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
                className="mt-6 bg-accent-900/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10"
              >
                <div className="p-4 bg-gradient-to-r from-primary-900/50 to-indigo-900/50 border-b border-white/10 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary-400" />
                  <h3 className="text-lg font-semibold text-white">
                    প্ল্যান #{selectedPlan.id} – লেনদেন তালিকা
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="ml-auto text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    বন্ধ করুন
                  </button>
                </div>
                {transactionsLoading ? (
                  <div className="py-8 text-center text-slate-400">
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
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
}
