"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { TrendingUp, Search, Download } from "lucide-react";
import { MOCK_INVESTMENTS, DATE_WISE_INVESTMENTS } from "@/constants/dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Table from "@/components/Table";
import { getTotalInvestmentColumns } from "@/columns/dashboard/total-investment";

export default function TotalInvestmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Filter investments based on search and filters
  const filteredInvestments = useMemo(() => {
    return MOCK_INVESTMENTS.filter((investment) => {
      const matchesSearch =
        searchQuery === "" ||
        investment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investment.amount.toString().includes(searchQuery) ||
        investment.date.includes(searchQuery);

      const matchesType = filterType === "all" || investment.type === filterType;
      const matchesStatus = filterStatus === "all" || investment.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, filterType, filterStatus]);

  // Get unique types and statuses for filter dropdowns
  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(MOCK_INVESTMENTS.map((inv) => inv.type)));
    return uniqueTypes;
  }, []);

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(MOCK_INVESTMENTS.map((inv) => inv.status)));
    return uniqueStatuses;
  }, []);

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
  const columns = getTotalInvestmentColumns({ formatDate });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">আপনার মোট বিনিয়োগ</h1>
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

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">সব ধরন</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
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
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-primary-50 rounded-lg px-4 py-2">
              <p className="text-sm text-primary-600">মোট বিনিয়োগ</p>
              <p className="text-xl font-bold text-primary-600">
                ৳ {filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString("bn-BD")}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-600">মোট সংখ্যা</p>
              <p className="text-xl font-bold text-blue-600">{filteredInvestments.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Bar Graph Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">তারিখ অনুযায়ী বিনিয়োগ</h2>
          <div className="h-80 w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={400}>
              <BarChart data={DATE_WISE_INVESTMENTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("bn-BD", { month: "short", day: "numeric" });
                  }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString("bn-BD")} ৳`, "বিনিয়োগ"]}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Bar
                  dataKey="amount"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Investments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4 bg-white rounded-t-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">বিনিয়োগ তালিকা</h2>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              রিপোর্ট ডাউনলোড
            </button>
          </div>
          <Table
            data={filteredInvestments}
            columns={columns}
            emptyMessage="কোন বিনিয়োগ পাওয়া যায়নি"
            className="rounded-t-none"
          />
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
}

