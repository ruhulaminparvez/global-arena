"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { MessageSquare, Search, Filter, Download, Plus, Send } from "lucide-react";

export default function CommunicationManagementPage() {

  // Mock communication data
  const communications = [
    { id: 1, title: "নতুন সঞ্চয় স্কিম", type: "ঘোষণা", recipients: "সকল", date: "2024-01-15", status: "প্রেরিত" },
    { id: 2, title: "সিস্টেম রক্ষণাবেক্ষণ", type: "সতর্কতা", recipients: "সকল", date: "2024-01-14", status: "প্রেরিত" },
    { id: 3, title: "মাসিক রিপোর্ট", type: "রিপোর্ট", recipients: "অ্যাডমিন", date: "2024-01-13", status: "খসড়া" },
    { id: 4, title: "বিনিয়োগ সুযোগ", type: "ঘোষণা", recipients: "সক্রিয় ব্যবহারকারী", date: "2024-01-12", status: "প্রেরিত" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">যোগাযোগ ম্যানেজমেন্ট</h1>
                <p className="text-gray-600 mt-1">ব্যবহারকারীদের সাথে যোগাযোগ পরিচালনা করুন</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                নতুন বার্তা
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
              placeholder="শিরোনাম, ধরন বা প্রাপক দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Communications Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">আইডি</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">শিরোনাম</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ধরন</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">প্রাপক</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">তারিখ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">স্ট্যাটাস</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {communications.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{comm.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{comm.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{comm.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{comm.recipients}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{comm.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${comm.status === "প্রেরিত"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {comm.status}
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
                        {comm.status === "খসড়া" && (
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            প্রেরণ
                          </button>
                        )}
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
