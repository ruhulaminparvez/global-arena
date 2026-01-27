"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { ArrowUpCircle, Search, Plus, X } from "lucide-react";
import { MOCK_WITHDRAWALS } from "@/constants/dashboard";
import type { Withdrawal } from "@/constants/dashboard";
import Table, { TableColumn } from "@/components/Table";

export default function WithdrawalPage() {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(MOCK_WITHDRAWALS);

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    method: "ব্যাংক",
    accountNumber: "",
    description: "",
  });

  // Filter withdrawals based on search and filters
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      const matchesSearch =
        searchQuery === "" ||
        withdrawal.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        withdrawal.amount.toString().includes(searchQuery) ||
        withdrawal.date.includes(searchQuery) ||
        (withdrawal.description && withdrawal.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMethod = filterMethod === "all" || withdrawal.method === filterMethod;
      const matchesStatus = filterStatus === "all" || withdrawal.status === filterStatus;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [withdrawals, searchQuery, filterMethod, filterStatus]);

  // Get unique methods and statuses for filter dropdowns
  const methods = useMemo(() => {
    return Array.from(new Set(withdrawals.map((w) => w.method)));
  }, [withdrawals]);

  const statuses = useMemo(() => {
    return Array.from(new Set(withdrawals.map((w) => w.status)));
  }, [withdrawals]);

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
  const columns: TableColumn<Withdrawal>[] = [
    {
      key: "id",
      label: "আইডি",
      className: "font-medium",
    },
    {
      key: "date",
      label: "তারিখ",
      render: (withdrawal) => formatDate(withdrawal.date),
    },
    {
      key: "amount",
      label: "পরিমাণ",
      render: (withdrawal) => (
        <span className="font-semibold">
          ৳ {withdrawal.amount.toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "method",
      label: "পদ্ধতি",
      className: "text-gray-600",
    },
    {
      key: "accountNumber",
      label: "অ্যাকাউন্ট নম্বর",
      render: (withdrawal) => (
        <span className="font-mono text-gray-600">{withdrawal.accountNumber}</span>
      ),
    },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (withdrawal) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${withdrawal.status === "অনুমোদিত"
              ? "bg-green-100 text-green-800"
              : withdrawal.status === "প্রত্যাখ্যান"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {withdrawal.status}
        </span>
      ),
    },
    {
      key: "description",
      label: "বিবরণ",
      render: (withdrawal) => (
        <span className="text-gray-600">{withdrawal.description || "-"}</span>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.accountNumber) {
      return;
    }

    const newWithdrawal: Withdrawal = {
      id: withdrawals.length + 1,
      date: new Date().toISOString().split("T")[0],
      amount: Number(formData.amount),
      method: formData.method,
      accountNumber: formData.accountNumber,
      status: "বিবেচনাধীন",
      description: formData.description,
    };

    setWithdrawals([newWithdrawal, ...withdrawals]);
    setFormData({ amount: "", method: "ব্যাংক", accountNumber: "", description: "" });
    setShowWithdrawalModal(false);
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
              <ArrowUpCircle className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">উত্তোলন</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWithdrawalModal(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              নতুন উত্তোলন
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
              <p className="text-sm text-primary-600">মোট উত্তোলন</p>
              <p className="text-xl font-bold text-primary-600">
                ৳ {filteredWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString("bn-BD")}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-600">মোট সংখ্যা</p>
              <p className="text-xl font-bold text-blue-600">{filteredWithdrawals.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Withdrawals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Table
            data={filteredWithdrawals}
            columns={columns}
            emptyMessage="কোন উত্তোলন পাওয়া যায়নি"
          />
        </motion.div>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowWithdrawalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">নতুন উত্তোলন</h3>
                <button
                  onClick={() => setShowWithdrawalModal(false)}
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
                    অ্যাকাউন্ট/মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="অ্যাকাউন্ট বা মোবাইল নম্বর লিখুন"
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
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    উত্তোলন করুন
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

