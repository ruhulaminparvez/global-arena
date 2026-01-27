"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { Ticket, Search, Filter, Download } from "lucide-react";
import Table from "@/components/Table";
import { getTicketsColumns } from "@/columns/admin/tickets";

export default function TicketManagementPage() {
  // Mock ticket data
  const tickets = [
    { id: 1, ticketNo: "TKT-001", userName: "আহমেদ হাসান", subject: "সঞ্চয় সম্পর্কে প্রশ্ন", priority: "উচ্চ", date: "2024-01-15", status: "খোলা" },
    { id: 2, ticketNo: "TKT-002", userName: "ফাতিমা খাতুন", subject: "বিনিয়োগ তথ্য", priority: "মধ্যম", date: "2024-01-14", status: "প্রক্রিয়াধীন" },
    { id: 3, ticketNo: "TKT-003", userName: "করিম উদ্দিন", subject: "অ্যাকাউন্ট সমস্যা", priority: "উচ্চ", date: "2024-01-13", status: "খোলা" },
    { id: 4, ticketNo: "TKT-004", userName: "রোকেয়া বেগম", subject: "পাসওয়ার্ড রিসেট", priority: "নিম্ন", date: "2024-01-12", status: "সমাধান" },
  ];

  // Table columns
  const columns = getTicketsColumns();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
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
        <div className="mb-6">
          <Table data={tickets} columns={columns} />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
