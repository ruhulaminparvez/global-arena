"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { Wallet, Search, Filter, Download } from "lucide-react";

export default function SavingsManagementPage() {

  // Mock savings data
  const savings = [
    { id: 1, userName: "আহমেদ হাসান", amount: 15000, date: "2024-01-15", status: "সক্রিয়" },
    { id: 2, userName: "ফাতিমা খাতুন", amount: 20000, date: "2024-01-14", status: "সক্রিয়" },
    { id: 3, userName: "করিম উদ্দিন", amount: 12000, date: "2024-01-13", status: "সক্রিয়" },
    { id: 4, userName: "রোকেয়া বেগম", amount: 18000, date: "2024-01-12", status: "সক্রিয়" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">সঞ্চয় ম্যানেজমেন্ট</h1>
                <p className="text-gray-600 mt-1">সমস্ত সঞ্চয় লেনদেন পরিচালনা করুন</p>
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
              placeholder="ব্যবহারকারীর নাম, পরিমাণ বা তারিখ দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Savings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">আইডি</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ব্যবহারকারীর নাম</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">পরিমাণ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">তারিখ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">স্ট্যাটাস</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {savings.map((saving) => (
                  <tr key={saving.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{saving.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{saving.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      ৳ {saving.amount.toLocaleString("bn-BD")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{saving.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {saving.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          দেখুন
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          সম্পাদনা
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
