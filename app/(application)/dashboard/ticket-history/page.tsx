"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { Ticket, Search, Filter, Calendar, Activity, ShoppingBag } from "lucide-react";
import Table from "@/components/Table";
import { getDashboardScheduleColumns } from "@/columns/dashboard/schedule";
import {
  getActiveSchedules,
  getAllSchedules,
  getMyPurchases,
  purchaseTicket,
} from "@/api/dashboard/tickets.api";
import type {
  TicketSchedule,
  AgreementType,
} from "@/api/dashboard/types/dashboard.api";

type TabId = "active" | "all" | "purchases";

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "active", label: "সক্রিয় সিডিউল টিকেট", icon: Activity },
  { id: "all", label: "সমস্ত সিডিউল টিকেট", icon: Calendar },
  { id: "purchases", label: "আমার ক্রয় তালিকা", icon: ShoppingBag },
];

function filterSchedules(
  list: TicketSchedule[],
  search: string,
  agreementFilter: AgreementType | ""
): TicketSchedule[] {
  let result = list;
  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.announcement_text.toLowerCase().includes(q) ||
        String(s.id).includes(q)
    );
  }
  if (agreementFilter) {
    result = result.filter((s) => s.agreement_type === agreementFilter);
  }
  return result;
}

export default function TicketHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("active");
  const [schedules, setSchedules] = useState<TicketSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [agreementFilter, setAgreementFilter] = useState<AgreementType | "">("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      switch (activeTab) {
        case "active":
          res = await getActiveSchedules();
          break;
        case "all":
          res = await getAllSchedules();
          break;
        case "purchases":
          res = await getMyPurchases();
          break;
        default:
          res = await getActiveSchedules();
      }
      setSchedules(res.results ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে";
      setError(message);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSchedules = useMemo(
    () => filterSchedules(schedules, searchQuery, agreementFilter),
    [schedules, searchQuery, agreementFilter]
  );

  const handlePurchase = useCallback(
    async (schedule: TicketSchedule) => {
      setPurchasingId(schedule.id);
      setError(null);
      try {
        await purchaseTicket(schedule.id);
        await fetchData();
      } catch {
        setError("ক্রয় সম্পন্ন করতে ব্যর্থ। আবার চেষ্টা করুন।");
      } finally {
        setPurchasingId(null);
      }
    },
    [fetchData]
  );

  const columns = useMemo(
    () =>
      getDashboardScheduleColumns(
        activeTab === "active"
          ? {
              onPurchase: handlePurchase,
              purchasingId,
            }
          : undefined
      ),
    [activeTab, handlePurchase, purchasingId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Ticket className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                টিকেট ইতিহাস
              </h1>
              <p className="text-gray-600 mt-1">
                সক্রিয় সিডিউল, সমস্ত টিকেট ও আপনার ক্রয় তালিকা
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Common Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম, বিবরণ বা আইডি দিয়ে অনুসন্ধান করুন..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterDropdownOpen((o) => !o)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors border border-gray-300"
              >
                <Filter className="w-4 h-4" />
                ফিল্টার
                {agreementFilter ? ` (${agreementFilter})` : ""}
              </button>
              {filterDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setFilterDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setAgreementFilter("");
                        setFilterDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        agreementFilter === ""
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      সব ধরন
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAgreementFilter("LONG");
                        setFilterDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        agreementFilter === "LONG"
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Long Term
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAgreementFilter("SHORT");
                        setFilterDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        agreementFilter === "SHORT"
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Short Term
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
              লোড হচ্ছে...
            </div>
          ) : (
            <Table
              data={filteredSchedules}
              columns={columns}
              emptyMessage="কোন ডেটা পাওয়া যায়নি"
              itemsPerPage={10}
            />
          )}
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
}
