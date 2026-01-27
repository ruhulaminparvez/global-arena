"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { ArrowDownCircle, Search, Plus, X } from "lucide-react";
import { MOCK_DEPOSITS } from "@/constants/dashboard";
import type { Deposit } from "@/constants/dashboard";
import Table from "@/components/Table";
import { getDepositColumns } from "@/columns/dashboard/deposit";

export default function DepositPage() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deposits, setDeposits] = useState<Deposit[]>(MOCK_DEPOSITS);

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    method: "ব্যাংক",
    transactionId: "",
    description: "",
  });

  // Filter deposits based on search and filters
  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const matchesSearch =
        searchQuery === "" ||
        deposit.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deposit.amount.toString().includes(searchQuery) ||
        deposit.date.includes(searchQuery) ||
        (deposit.description && deposit.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMethod = filterMethod === "all" || deposit.method === filterMethod;
      const matchesStatus = filterStatus === "all" || deposit.status === filterStatus;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [deposits, searchQuery, filterMethod, filterStatus]);

  // Get unique methods and statuses for filter dropdowns
  const methods = useMemo(() => {
    return Array.from(new Set(deposits.map((dep) => dep.method)));
  }, [deposits]);

  const statuses = useMemo(() => {
    return Array.from(new Set(deposits.map((dep) => dep.status)));
  }, [deposits]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Table columns
  const columns = getDepositColumns({ formatDate });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.transactionId) {
      return;
    }

    const newDeposit: Deposit = {
      id: deposits.length + 1,
      date: new Date().toISOString().split("T")[0],
      amount: Number(formData.amount),
      method: formData.method,
      transactionId: formData.transactionId,
      status: "বিবেচনাধীন",
      description: formData.description,
    };

    setDeposits([newDeposit, ...deposits]);
    setFormData({ amount: "", method: "ব্যাংক", transactionId: "", description: "" });
    setShowDepositModal(false);
  };

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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">জমা</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDepositModal(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              নতুন জমা
            </motion.button>
          </div>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="অনুসন্ধান করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">সব পদ্ধতি</option>
              {methods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">সব স্ট্যাটাস</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-primary-50 rounded-lg px-4 py-2">
              <p className="text-sm text-primary-600">মোট জমা</p>
              <p className="text-xl font-bold text-primary-600">
                ৳ {filteredDeposits.reduce((sum, dep) => sum + dep.amount, 0).toLocaleString("bn-BD")}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-600">মোট সংখ্যা</p>
              <p className="text-xl font-bold text-blue-600">{filteredDeposits.length}</p>
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
          <Table
            data={filteredDeposits}
            columns={columns}
            emptyMessage="কোন জমা পাওয়া যায়নি"
          />
        </motion.div>
      </div>

      {/* Deposit Modal */}
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
                <h3 className="text-2xl font-bold text-gray-900">নতুন জমা</h3>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="পরিমাণ লিখুন"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পদ্ধতি
                  </label>
                  <select
                    required
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="ব্যাংক">ব্যাংক</option>
                    <option value="মোবাইল">মোবাইল</option>
                    <option value="নগদ">নগদ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ট্রান্সাকশন আইডি
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="ট্রান্সাকশন আইডি লিখুন"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিবরণ (ঐচ্ছিক)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="বিবরণ লিখুন"
                  />
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
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    জমা করুন
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

