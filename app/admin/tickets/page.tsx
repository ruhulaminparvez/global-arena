"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { Ticket, Search, Filter, Download } from "lucide-react";

export default function TicketManagementPage() {

  // Mock ticket data
  const tickets = [
    { id: 1, ticketNo: "TKT-001", userName: "আহমেদ হাসান", subject: "সঞ্চয় সম্পর্কে প্রশ্ন", priority: "উচ্চ", date: "2024-01-15", status: "খোলা" },
    { id: 2, ticketNo: "TKT-002", userName: "ফাতিমা খাতুন", subject: "বিনিয়োগ তথ্য", priority: "মধ্যম", date: "2024-01-14", status: "প্রক্রিয়াধীন" },
    { id: 3, ticketNo: "TKT-003", userName: "করিম উদ্দিন", subject: "অ্যাকাউন্ট সমস্যা", priority: "উচ্চ", date: "2024-01-13", status: "খোলা" },
    { id: 4, ticketNo: "TKT-004", userName: "রোকেয়া বেগম", subject: "পাসওয়ার্ড রিসেট", priority: "নিম্ন", date: "2024-01-12", status: "সমাধান" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[15.5rem] sm:pb-[10.5rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Ticket className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">টিকেট ম্যানেজমেন্ট</h1>
                <p className="text-gray-600 mt-1">সমস্ত সহায়তা টিকেট পরিচালনা করুন</p>
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
              placeholder="টিকেট নম্বর, ব্যবহারকারীর নাম বা বিষয় দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">টিকেট নম্বর</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ব্যবহারকারীর নাম</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">বিষয়</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">অগ্রাধিকার</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">তারিখ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">স্ট্যাটাস</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono font-semibold">{ticket.ticketNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        ticket.priority === "উচ্চ" 
                          ? "bg-red-100 text-red-800" 
                          : ticket.priority === "মধ্যম"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === "সমাধান" 
                          ? "bg-green-100 text-green-800" 
                          : ticket.status === "প্রক্রিয়াধীন"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          দেখুন
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          উত্তর দিন
                        </button>
                        {ticket.status !== "সমাধান" && (
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            সমাধান
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
