"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { ArrowUpCircle, Search, Filter, Download } from "lucide-react";
import Table from "@/components/Table";
import { getWithdrawalsColumns } from "@/columns/admin/withdrawals";

export default function WithdrawalManagementPage() {
  // Mock withdrawal data
  const withdrawals = [
    { id: 1, userName: "আহমেদ হাসান", amount: 5000, method: "ব্যাংক", date: "2024-01-15", status: "বিবেচনাধীন" },
    { id: 2, userName: "ফাতিমা খাতুন", amount: 8000, method: "মোবাইল", date: "2024-01-14", status: "অনুমোদিত" },
    { id: 3, userName: "করিম উদ্দিন", amount: 3000, method: "ব্যাংক", date: "2024-01-13", status: "অনুমোদিত" },
    { id: 4, userName: "রোকেয়া বেগম", amount: 6000, method: "মোবাইল", date: "2024-01-12", status: "বিবেচনাধীন" },
  ];

  // Table columns
  const columns = getWithdrawalsColumns();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ArrowUpCircle className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">উত্তোলন ম্যানেজমেন্ট</h1>
                <p className="text-gray-600 mt-1">সমস্ত উত্তোলন লেনদেন পরিচালনা করুন</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
                <Filter className="w-4 h-4" />
                ফিল্টার
              </button>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                রিপোর্ট
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ব্যবহারকারীর নাম, পরিমাণ বা পদ্ধতি দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="mb-6">
          <Table data={withdrawals} columns={columns} />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
