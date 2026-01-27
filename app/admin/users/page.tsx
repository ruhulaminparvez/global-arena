"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { Users, Search, Filter, Download, Plus, UserPlus } from "lucide-react";
import Table, { TableColumn } from "@/components/Table";

export default function UserManagementPage() {
  // Mock user data
  const users = [
    { id: 1, name: "আহমেদ হাসান", email: "ahmed@example.com", phone: "01712345678", role: "ব্যবহারকারী", status: "সক্রিয়", joinDate: "2024-01-01" },
    { id: 2, name: "ফাতিমা খাতুন", email: "fatima@example.com", phone: "01712345679", role: "ব্যবহারকারী", status: "সক্রিয়", joinDate: "2024-01-02" },
    { id: 3, name: "করিম উদ্দিন", email: "karim@example.com", phone: "01712345680", role: "ব্যবহারকারী", status: "নিষ্ক্রিয়", joinDate: "2024-01-03" },
    { id: 4, name: "রোকেয়া বেগম", email: "rokeya@example.com", phone: "01712345681", role: "ব্যবহারকারী", status: "সক্রিয়", joinDate: "2024-01-04" },
  ];

  // Table columns
  const columns: TableColumn<typeof users[0]>[] = [
    { key: "id", label: "আইডি" },
    { key: "name", label: "নাম", className: "font-medium" },
    { key: "email", label: "ইমেইল", className: "text-gray-600" },
    { key: "phone", label: "ফোন", className: "text-gray-600" },
    { key: "role", label: "ভূমিকা", className: "text-gray-600" },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (user) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${user.status === "সক্রিয়"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          {user.status}
        </span>
      ),
    },
    { key: "joinDate", label: "যোগদান তারিখ", className: "text-gray-600" },
    {
      key: "actions",
      label: "কার্যক্রম",
      render: () => (
        <div className="flex gap-2">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            দেখুন
          </button>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            সম্পাদনা
          </button>
        </div>
      ),
    },
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ইউজার ম্যানেজমেন্ট</h1>
                <p className="text-gray-600 mt-1">সমস্ত ব্যবহারকারী পরিচালনা করুন</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                <UserPlus className="w-4 h-4" />
                নতুন ব্যবহারকারী
              </button>
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
              placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="mb-6">
          <Table data={users} columns={columns} />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
