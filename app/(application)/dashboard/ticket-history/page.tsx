"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import BottomNavigation from "../_components/BottomNavigation";
import { Ticket, Search, Filter, Calendar, Activity, ShoppingBag, X, ChevronRight } from "lucide-react";
import Table from "@/components/Table";
import {
  getDashboardScheduleColumns,
  getPurchaseColumns,
  type PurchaseColumnsOptions,
} from "@/columns/dashboard/schedule";
import {
  getActiveSchedules,
  getAllSchedules,
  getMyPurchases,
  purchaseTicket,
} from "@/api/dashboard/tickets.api";
import type {
  TicketSchedule,
  TicketPurchase,
  AgreementType,
} from "@/api/dashboard/types/dashboard.api";

type TabId = "active" | "all" | "purchases";

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "active", label: "সক্রিয় সিডিউল টিকেট", icon: Activity },
  { id: "all", label: "সমস্ত সিডিউল টিকেট", icon: Calendar },
  { id: "purchases", label: "আমার ক্রয় তালিকা", icon: ShoppingBag },
];

// Bangla label map for all known field keys
const FIELD_LABELS: Record<string, string> = {
  // TicketSchedule
  id: "আইডি",
  title: "শিরোনাম",
  description: "বিবরণ",
  announcement_text: "ঘোষণার বিষয়বস্তু",
  price: "মূল্য",
  profit_percentage: "লাভের শতাংশ",
  profit_amount: "লাভের পরিমাণ",
  agreement_type: "চুক্তির ধরন (কোড)",
  agreement_type_display: "চুক্তির ধরন",
  duration_days: "মেয়াদ (দিন)",
  announcement_date: "ঘোষণার তারিখ",
  drop_time: "ড্রপ টাইম",
  event_date: "ইভেন্ট তারিখ",
  is_active: "সক্রিয়",
  is_announced: "ঘোষণা করা হয়েছে",
  is_confirmed: "নিশ্চিত করা হয়েছে",
  max_tickets: "সর্বোচ্চ টিকেট",
  total_purchases: "মোট ক্রয়",
  is_available: "উপলব্ধ",
  can_be_purchased: "ক্রয় করা যাবে",
  created_at: "তৈরির তারিখ",
  updated_at: "আপডেটের তারিখ",
  // TicketPurchase
  user: "ব্যবহারকারী আইডি",
  user_name: "ব্যবহারকারীর নাম",
  ticket: "টিকেট বিবরণ",
  purchase_price: "ক্রয় মূল্য",
  profit_added: "লাভ যোগ হয়েছে",
};

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

function filterPurchases(list: TicketPurchase[], search: string): TicketPurchase[] {
  if (!search.trim()) return list;
  const q = search.trim().toLowerCase();
  return list.filter(
    (p) =>
      p.user_name.toLowerCase().includes(q) ||
      p.ticket.title.toLowerCase().includes(q) ||
      String(p.id).includes(q)
  );
}

// ─── Detail Modal ───────────────────────────────────────────────────────────

type AnyValue = string | number | boolean | null | undefined | AnyValue[] | { [k: string]: AnyValue };

function DetailValue({ value }: { value: AnyValue }) {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">null</span>;
  }
  if (typeof value === "boolean") {
    return (
      <span
        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
        }`}
      >
        {value ? "হ্যাঁ" : "না"}
      </span>
    );
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <div className="mt-1 ml-3 border-l-2 border-primary-100 pl-3 space-y-1.5">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex flex-col sm:flex-row sm:items-start gap-1">
            <span className="text-xs font-semibold text-primary-600 min-w-[140px] shrink-0">
              {FIELD_LABELS[k] ?? k}
            </span>
            <DetailValue value={v as AnyValue} />
          </div>
        ))}
      </div>
    );
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400 italic">[]</span>;
    return (
      <div className="space-y-1 mt-1">
        {value.map((v, i) => (
          <div key={i} className="flex gap-1 items-start">
            <span className="text-gray-400 text-xs">[{i}]</span>
            <DetailValue value={v} />
          </div>
        ))}
      </div>
    );
  }
  // string or number
  const str = String(value);
  // Detect ISO date
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
    try {
      const date = new Date(str).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <span className="text-gray-800">
          {date}{" "}
          <span className="text-gray-400 text-xs">({str})</span>
        </span>
      );
    } catch {
      /* fall through */
    }
  }
  return <span className="text-gray-800 break-all">{str}</span>;
}

function DetailModal({
  row,
  onClose,
}: {
  row: Record<string, AnyValue>;
  onClose: () => void;
}) {
  const title =
    (row.title as string) ??
    (row.user_name as string) ??
    `আইডি: ${row.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-gradient-to-r from-primary-50 to-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base truncate">{title}</h2>
              <p className="text-xs text-gray-500">বিস্তারিত তথ্য</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-0.5">
          {Object.entries(row).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-50 last:border-0"
            >
              <span className="text-sm font-semibold text-primary-700 min-w-[180px] shrink-0">
                {FIELD_LABELS[key] ?? key}
              </span>
              <div className="text-sm flex-1">
                <DetailValue value={value} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 shrink-0 rounded-b-2xl bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors border border-gray-200"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TicketHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("active");
  const [schedules, setSchedules] = useState<TicketSchedule[]>([]);
  const [purchases, setPurchases] = useState<TicketPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [agreementFilter, setAgreementFilter] = useState<AgreementType | "">("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<Record<string, AnyValue> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await getActiveSchedules();
        setSchedules(res.results ?? []);
      } else if (activeTab === "all") {
        const res = await getAllSchedules();
        setSchedules(res.results ?? []);
      } else {
        const res = await getMyPurchases();
        setPurchases(res.results ?? []);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে";
      setError(message);
      setSchedules([]);
      setPurchases([]);
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

  const filteredPurchases = useMemo(
    () => filterPurchases(purchases, searchQuery),
    [purchases, searchQuery]
  );

  const handlePurchase = useCallback(
    async (schedule: TicketSchedule) => {
      setPurchasingId(schedule.id);
      const toastId = toast.loading("টিকেট ক্রয় প্রক্রিয়াকরণ হচ্ছে...");
      try {
        await purchaseTicket(schedule.id);
        toast.success("টিকেট সফলভাবে ক্রয় সম্পন্ন হয়েছে!", { id: toastId });
        await fetchData();
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "ক্রয় সম্পন্ন করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
        toast.error(message, { id: toastId });
      } finally {
        setPurchasingId(null);
      }
    },
    [fetchData]
  );

  const handleRowClick = useCallback((row: Record<string, AnyValue>) => {
    setSelectedRow(row);
  }, []);

  const scheduleColumns = useMemo(
    () =>
      getDashboardScheduleColumns({
        ...(activeTab === "active"
          ? { onPurchase: handlePurchase, purchasingId }
          : {}),
        onView: (row) => setSelectedRow(row as unknown as Record<string, AnyValue>),
      }),
    [activeTab, handlePurchase, purchasingId]
  );

  const purchaseColumns = useMemo(
    () =>
      getPurchaseColumns({
        onView: (row) => setSelectedRow(row as unknown as Record<string, AnyValue>),
      } as PurchaseColumnsOptions),
    []
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

          {/* Search & Filter */}
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
            {activeTab !== "purchases" && (
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
            )}
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
          ) : activeTab === "purchases" ? (
            <Table
              data={filteredPurchases}
              columns={purchaseColumns}
              emptyMessage="কোন ক্রয় পাওয়া যায়নি"
              itemsPerPage={10}
              onRowClick={(row) => handleRowClick(row as unknown as Record<string, AnyValue>)}
            />
          ) : (
            <Table
              data={filteredSchedules}
              columns={scheduleColumns}
              emptyMessage="কোন ডেটা পাওয়া যায়নি"
              itemsPerPage={10}
              onRowClick={(row) => handleRowClick(row as unknown as Record<string, AnyValue>)}
            />
          )}
        </motion.div>
      </div>

      <BottomNavigation />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRow && (
          <DetailModal
            row={selectedRow}
            onClose={() => setSelectedRow(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
