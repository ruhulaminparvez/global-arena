"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import AdminHeader from "../_components/AdminHeader";
import AdminSidebarMenu from "../_components/AdminSidebarMenu";
import { Clock, Search, Filter, Download, Plus } from "lucide-react";

export default function ScheduleManagementPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuClick = (item: MenuItem): void => {
    if (item.id === 9) {
      logout();
      router.push("/login");
    } else if (item.route) {
      router.push(item.route);
      setIsMenuOpen(false);
    }
  };

  // Mock schedule data
  const schedules = [
    { id: 1, userName: "আহমেদ হাসান", type: "জমা", amount: 10000, frequency: "মাসিক", nextDate: "2024-02-15", status: "সক্রিয়" },
    { id: 2, userName: "ফাতিমা খাতুন", type: "উত্তোলন", amount: 5000, frequency: "সাপ্তাহিক", nextDate: "2024-01-21", status: "সক্রিয়" },
    { id: 3, userName: "করিম উদ্দিন", type: "জমা", amount: 8000, frequency: "মাসিক", nextDate: "2024-02-13", status: "বন্ধ" },
    { id: 4, userName: "রোকেয়া বেগম", type: "জমা", amount: 12000, frequency: "মাসিক", nextDate: "2024-02-12", status: "সক্রিয়" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <AdminSidebarMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onMenuClick={handleMenuClick}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 overflow-x-hidden">
        <AdminHeader
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">সময়সূচি ম্যানেজমেন্ট</h1>
                <p className="text-gray-600 mt-1">সমস্ত সময়সূচি পরিচালনা করুন</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                নতুন সময়সূচি
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
              placeholder="ব্যবহারকারীর নাম, ধরন বা ফ্রিকোয়েন্সি দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Schedules Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">আইডি</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ব্যবহারকারীর নাম</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ধরন</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">পরিমাণ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ফ্রিকোয়েন্সি</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">পরবর্তী তারিখ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">স্ট্যাটাস</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{schedule.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{schedule.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{schedule.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      ৳ {schedule.amount.toLocaleString("bn-BD")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{schedule.frequency}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{schedule.nextDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        schedule.status === "সক্রিয়" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {schedule.status}
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
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          বন্ধ করুন
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
    </div>
  );
}
