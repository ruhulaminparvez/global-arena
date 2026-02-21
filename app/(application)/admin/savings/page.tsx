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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  সঞ্চয় ম্যানেজমেন্ট
                </h1>
                <p className="text-gray-600 mt-1">
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

        {/* Tab: All Saving Plans */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="relative flex gap-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  value={plansSearch}
                  onChange={(e) => setPlansSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePlansSearch()}
                  placeholder="ব্যবহারকারী, পরিমাণ বা তারিখ দিয়ে অনুসন্ধান করুন..."
                  className="flex-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={handlePlansSearch}
                  className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shrink-0"
                >
                  অনুসন্ধান
                </button>
              </div>
            </div>
            <div>
              {plansLoading ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
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
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="relative flex gap-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  value={transactionsSearch}
                  onChange={(e) => setTransactionsSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTransactionsSearch()}
                  placeholder="প্ল্যান, পরিমাণ বা তারিখ দিয়ে অনুসন্ধান করুন..."
                  className="flex-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={handleTransactionsSearch}
                  className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shrink-0"
                >
                  অনুসন্ধান
                </button>
              </div>
            </div>
            <div>
              {transactionsLoading ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
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
