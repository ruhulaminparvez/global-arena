"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import BottomNavigation from "../_components/BottomNavigation";
import { Wallet, Search, PiggyBank, Receipt, Plus } from "lucide-react";
import Table from "@/components/Table";
import { Button } from "@/components/button";
import { CreateSavingPlanModal } from "./_components/CreateSavingPlanModal";
import {
  getSavingsPlanColumns,
  getSavingsTransactionColumns,
} from "@/columns/admin/savings";
import {
  getSavingsPlans,
  getSavingsTransactions,
  type SavingsPlansParams,
  type SavingsTransactionsParams,
} from "@/api/admin/savings.manage.api";
import type {
  SavingPlan,
  SavingTransaction,
} from "@/api/admin/types/admin.api";

type TabId = "plans" | "transactions";

export default function SavingsManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>("plans");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Plans state
  const [plans, setPlans] = useState<SavingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansSearch, setPlansSearch] = useState("");

  // Transactions state
  const [transactions, setTransactions] = useState<SavingTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsSearch, setTransactionsSearch] = useState("");

  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const params: SavingsPlansParams = {};
      if (plansSearch.trim()) params.search = plansSearch.trim();
      const res = await getSavingsPlans(params);
      setPlans(res.results ?? []);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "সঞ্চয় প্ল্যান লোড করতে সমস্যা হয়েছে।";
      toast.error(msg);
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  }, [plansSearch]);

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      const params: SavingsTransactionsParams = {};
      if (transactionsSearch.trim()) params.search = transactionsSearch.trim();
      const res = await getSavingsTransactions(params);
      setTransactions(res.results ?? []);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "সঞ্চয় লেনদেন লোড করতে সমস্যা হয়েছে।";
      toast.error(msg);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }, [transactionsSearch]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePlansSearch = () => fetchPlans();
  const handleTransactionsSearch = () => fetchTransactions();

  const plansColumns = getSavingsPlanColumns();
  const transactionsColumns = getSavingsTransactionColumns();

  const tabs: { id: TabId; label: string; icon: typeof PiggyBank }[] = [
    { id: "plans", label: "সমস্ত সঞ্চয় প্ল্যান", icon: PiggyBank },
    { id: "transactions", label: "সমস্ত সঞ্চয় লেনদেন", icon: Receipt },
  ];

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
                <Wallet className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  সঞ্চয় ম্যানেজমেন্ট
                </h1>
                <p className="text-slate-300 mt-1">
                  সমস্ত সঞ্চয় প্ল্যান ও লেনদেন পরিচালনা করুন
                </p>
              </div>
            </div>
            <Button
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
              size="sm"
            >
              নতুন সঞ্চয় প্ল্যান
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden p-1 flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-300 rounded-xl ${isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab: All Saving Plans */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
              <div className="relative flex gap-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  value={plansSearch}
                  onChange={(e) => setPlansSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePlansSearch()}
                  placeholder="ব্যবহারকারী, পরিমাণ বা তারিখ দিয়ে অনুসন্ধান করুন..."
                  className="flex-1 pl-10 pr-4 py-3 bg-accent-900/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handlePlansSearch}
                  className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium shrink-0 shadow-lg shadow-primary-500/25 transition-all"
                >
                  অনুসন্ধান
                </button>
              </div>
            </div>
            <div>
              {plansLoading ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-12 text-center text-slate-400">
                  সঞ্চয় প্ল্যান লোড হচ্ছে...
                </div>
              ) : (
                <Table
                  data={plans}
                  columns={plansColumns}
                  emptyMessage="কোন সঞ্চয় প্ল্যান পাওয়া যায়নি"
                  itemsPerPage={10}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab: All Saving Transactions */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
              <div className="relative flex gap-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  value={transactionsSearch}
                  onChange={(e) => setTransactionsSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTransactionsSearch()}
                  placeholder="প্ল্যান, পরিমাণ বা তারিখ দিয়ে অনুসন্ধান করুন..."
                  className="flex-1 pl-10 pr-4 py-3 bg-accent-900/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleTransactionsSearch}
                  className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium shrink-0 shadow-lg shadow-primary-500/25 transition-all"
                >
                  অনুসন্ধান
                </button>
              </div>
            </div>
            <div>
              {transactionsLoading ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-12 text-center text-slate-400">
                  সঞ্চয় লেনদেন লোড হচ্ছে...
                </div>
              ) : (
                <Table
                  data={transactions}
                  columns={transactionsColumns}
                  emptyMessage="কোন সঞ্চয় লেনদেন পাওয়া যায়নি"
                  itemsPerPage={10}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />

      {showCreateModal && (
        <CreateSavingPlanModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            fetchPlans();
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
}
