"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { Users, Search, Filter, Download, Plus, UserPlus } from "lucide-react";

export default function UserManagementPage() {

  // Mock user data
  const users = [
    { id: 1, name: "আহমেদ হাসান", email: "ahmed@example.com", phone: "01712345678", role: "ব্যবহারকারী", status: "সক্রিয়", joinDate: "2024-01-01" },
    { id: 2, name: "ফাতিমা খাতুন", email: "fatima@example.com", phone: "01712345679", role: "ব্যবহারকারী", status: "সক্রিয়", joinDate: "2024-01-02" },
    { id: 3, name: "করিম উদ্দিন", email: "karim@example.com", phone: "01712345680", role: "ব্যবহারকারী", status: "নিষ্ক্রিয়", joinDate: "2024-01-03" },
    { id: 4, name: "রোকেয়া বেগম", email: "rokeya@example.com", phone: "01712345681", role: "ব্যবহারকারী", status: "সক্রিয়", joinDate: "2024-01-04" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[15.5rem] sm:pb-[10.5rem] overflow-x-hidden">
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">আইডি</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">নাম</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ইমেইল</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ফোন</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ভূমিকা</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">স্ট্যাটাস</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">যোগদান তারিখ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "সক্রিয়" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          দেখুন
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          সম্পাদনা
                        </button>
                        <button className={`text-sm font-medium ${
                          user.status === "সক্রিয়"
                            ? "text-red-600 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        }`}>
                          {user.status === "সক্রিয়" ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
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
