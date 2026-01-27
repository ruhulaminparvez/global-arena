"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { Building2, Search, Megaphone, RefreshCw, Calendar, Filter } from "lucide-react";
import { MOCK_COMPANY_HISTORY } from "@/constants/dashboard";
import type { CompanyHistory } from "@/types/dashboard";

export default function CompanyHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Filter company history based on search and filters
  const filteredHistory = useMemo(() => {
    return MOCK_COMPANY_HISTORY.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.includes(searchQuery);

      const matchesType = filterType === "all" || item.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);

  // Get unique types for filter dropdown
  const types = useMemo(() => {
    return Array.from(new Set(MOCK_COMPANY_HISTORY.map((item) => item.type)));
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

  // Get type label and icon
  const getTypeInfo = (type: CompanyHistory["type"]) => {
    switch (type) {
      case "announcement":
        return {
          label: "ঘোষণা",
          icon: Megaphone,
          color: "bg-blue-100 text-blue-800 border-blue-200",
          dotColor: "bg-blue-500",
        };
      case "update":
        return {
          label: "আপডেট",
          icon: RefreshCw,
          color: "bg-green-100 text-green-800 border-green-200",
          dotColor: "bg-green-500",
        };
      case "event":
        return {
          label: "ইভেন্ট",
          icon: Calendar,
          color: "bg-purple-100 text-purple-800 border-purple-200",
          dotColor: "bg-purple-500",
        };
      default:
        return {
          label: "অন্যান্য",
          icon: Building2,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          dotColor: "bg-gray-500",
        };
    }
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
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">কোম্পানির ইতিহাস</h1>
          </div>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
              >
                <option value="all">সব ধরন</option>
                {types.map((type) => {
                  const typeInfo = getTypeInfo(type);
                  return (
                    <option key={type} value={type}>
                      {typeInfo.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-600">মোট ঘোষণা</p>
              <p className="text-xl font-bold text-blue-600">
                {MOCK_COMPANY_HISTORY.filter((item) => item.type === "announcement").length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg px-4 py-2">
              <p className="text-sm text-green-600">মোট আপডেট</p>
              <p className="text-xl font-bold text-green-600">
                {MOCK_COMPANY_HISTORY.filter((item) => item.type === "update").length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg px-4 py-2">
              <p className="text-sm text-purple-600">মোট ইভেন্ট</p>
              <p className="text-xl font-bold text-purple-600">
                {MOCK_COMPANY_HISTORY.filter((item) => item.type === "event").length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          {filteredHistory.length > 0 ? (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {filteredHistory.map((item, index) => {
                  const typeInfo = getTypeInfo(item.type);
                  const TypeIcon = typeInfo.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex gap-6"
                    >
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-full ${typeInfo.color} border-2 flex items-center justify-center shadow-lg`}
                        >
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        <div
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${typeInfo.dotColor} rounded-full border-2 border-white`}
                        ></div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full border ${typeInfo.color}`}
                              >
                                {typeInfo.label}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(item.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">কোন ইতিহাস পাওয়া যায়নি</p>
            </div>
          )}
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
}

