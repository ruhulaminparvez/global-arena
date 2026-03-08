"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { Ticket, Search, Filter, Plus, Calendar, Activity, Megaphone, ShoppingBag } from "lucide-react";
import Table from "@/components/Table";
import { Button } from "@/components/button";
import { getScheduleColumns, getPurchaseColumns } from "@/columns/admin/schedule";
import { ScheduleFormModal } from "./_components/ScheduleFormModal";
import { DeleteScheduleModal } from "./_components/DeleteScheduleModal";
import { TicketDetailModal } from "./_components/TicketDetailModal";
import {
  createTicketSchedule,
  getAllTicketSchedules,
  updateTicketSchedule,
  deleteTicketSchedule,
  getActiveTicketSchedules,
  getAnnouncedTicketSchedules,
  getAllTicketPurchases,
} from "@/api/admin/tickets.mange.api";
import type {
  TicketSchedule,
  TicketPurchase,
  TicketSchedulePayload,
  AgreementType,
} from "@/api/admin/types/admin.api";

type TabId = "all" | "active" | "announced" | "purchases";

const TABS: { id: TabId; label: string; icon: typeof Calendar }[] = [
  { id: "all", label: "সমস্ত সিডিউল", icon: Calendar },
  { id: "active", label: "সক্রিয় টিকেট", icon: Activity },
  { id: "announced", label: "ঘোষিত টিকেট", icon: Megaphone },
  { id: "purchases", label: "সমস্ত ক্রয়", icon: ShoppingBag },
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

export default function TicketManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [schedules, setSchedules] = useState<TicketSchedule[]>([]);
  const [purchases, setPurchases] = useState<TicketPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [agreementFilter, setAgreementFilter] = useState<AgreementType | "">("");
  const [formModal, setFormModal] = useState<"create" | "update" | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<TicketSchedule | null>(null);
  const [deleteSchedule, setDeleteSchedule] = useState<TicketSchedule | null>(null);
  const [detailItem, setDetailItem] = useState<{
    item: TicketSchedule | TicketPurchase;
    type: "schedule" | "purchase";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "purchases") {
        const res = await getAllTicketPurchases();
        setPurchases(res.results ?? []);
      } else {
        let res;
        switch (activeTab) {
          case "all":
            res = await getAllTicketSchedules();
            break;
          case "active":
            res = await getActiveTicketSchedules();
            break;
          case "announced":
            res = await getAnnouncedTicketSchedules();
            break;
          default:
            res = await getAllTicketSchedules();
        }
        setSchedules(res.results ?? []);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে";
      setError(message);
      if (activeTab === "purchases") setPurchases([]);
      else setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const filteredSchedules = useMemo(
    () => filterSchedules(schedules, searchQuery, agreementFilter),
    [schedules, searchQuery, agreementFilter]
  );

  const scheduleColumns = useMemo(
    () =>
      getScheduleColumns({
        ...(activeTab === "all"
          ? {
            onEdit: (schedule) => {
              setEditingSchedule(schedule);
              setFormModal("update");
            },
            onDelete: (schedule) => setDeleteSchedule(schedule),
          }
          : {}),
        onViewDetail: (schedule) =>
          setDetailItem({ item: schedule, type: "schedule" }),
      }),
    [activeTab]
  );

  const purchaseColumns = useMemo(
    () =>
      getPurchaseColumns({
        onViewDetail: (purchase) =>
          setDetailItem({ item: purchase, type: "purchase" }),
      }),
    []
  );

  const handleCreateSchedule = async (payload: TicketSchedulePayload) => {
    const loadingToast = toast.loading("সিডিউল তৈরি হচ্ছে...");
    try {
      await createTicketSchedule(payload);
      toast.dismiss(loadingToast);
      toast.success("সিডিউল সফলভাবে তৈরি হয়েছে!");
      await fetchSchedules();
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const message = err instanceof Error ? err.message : "সিডিউল তৈরি করতে সমস্যা হয়েছে";
      toast.error(message);
      throw err;
    }
  };

  const handleUpdateSchedule = async (payload: TicketSchedulePayload) => {
    if (!editingSchedule) return;
    const loadingToast = toast.loading("সিডিউল আপডেট হচ্ছে...");
    try {
      await updateTicketSchedule(editingSchedule.id, payload);
      toast.dismiss(loadingToast);
      toast.success("সিডিউল সফলভাবে আপডেট হয়েছে!");
      setEditingSchedule(null);
      setFormModal(null);
      await fetchSchedules();
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const message = err instanceof Error ? err.message : "সিডিউল আপডেট করতে সমস্যা হয়েছে";
      toast.error(message);
      throw err;
    }
  };

  const handleDeleteSchedule = async () => {
    if (!deleteSchedule) return;
    setIsDeleting(true);
    const loadingToast = toast.loading("সিডিউল মুছে ফেলা হচ্ছে...");
    try {
      await deleteTicketSchedule(deleteSchedule.id);
      toast.dismiss(loadingToast);
      toast.success("সিডিউল সফলভাবে মুছে ফেলা হয়েছে!");
      setDeleteSchedule(null);
      await fetchSchedules();
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const message = err instanceof Error ? err.message : "সিডিউল মুছে ফেলতে সমস্যা হয়েছে";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent-950 overflow-x-hidden relative text-white font-sans">
      {/* Premium Background Graphics */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-cyan-900/20 mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-50"></div>
          <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-500/20 rounded-2xl border border-primary-500/30">
                <Ticket className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  টিকেট সিডিউল ম্যানেজমেন্ট
                </h1>
                <p className="text-slate-300 mt-1">
                  সিডিউল তৈরি, আপডেট ও পরিচালনা করুন
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                icon={Plus}
                onClick={() => {
                  setEditingSchedule(null);
                  setFormModal("create");
                }}
              >
                সিডিউল তৈরি
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden p-1 flex flex-wrap">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-300 rounded-xl ${isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম, বিবরণ বা আইডি দিয়ে অনুসন্ধান করুন..."
                className="w-full pl-10 pr-4 py-3 bg-accent-900/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterDropdownOpen((o) => !o)}
                className="w-full sm:w-auto px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl flex items-center gap-2 transition-all duration-300 border border-white/10"
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
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 py-2 bg-accent-900 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setAgreementFilter("");
                        setFilterDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${agreementFilter === "" ? "bg-primary-500/20 text-primary-400 font-medium" : "text-slate-300 hover:bg-white/5 hover:text-white"
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
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${agreementFilter === "LONG" ? "bg-primary-500/20 text-primary-400 font-medium" : "text-slate-300 hover:bg-white/5 hover:text-white"
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
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${agreementFilter === "SHORT" ? "bg-primary-500/20 text-primary-400 font-medium" : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      Short Term
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-6">
          {error && (
            <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}
          {loading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-12 text-center text-slate-400">
              লোড হচ্ছে...
            </div>
          ) : activeTab === "purchases" ? (
            <Table
              data={purchases}
              columns={purchaseColumns}
              emptyMessage="কোন ক্রয় পাওয়া যায়নি"
              itemsPerPage={10}
              onRowClick={(item) => setDetailItem({ item, type: "purchase" })}
            />
          ) : (
            <Table
              data={filteredSchedules}
              columns={scheduleColumns}
              emptyMessage="কোন সিডিউল পাওয়া যায়নি"
              itemsPerPage={10}
              onRowClick={(item) => setDetailItem({ item, type: "schedule" })}
            />
          )}
        </div>
      </div>

      <BottomNavigation />

      {/* Create / Update Modal */}
      <AnimatePresence>
        {formModal && (
          <ScheduleFormModal
            mode={formModal}
            schedule={editingSchedule}
            onClose={() => {
              setFormModal(null);
              setEditingSchedule(null);
            }}
            onSubmit={
              formModal === "create" ? handleCreateSchedule : handleUpdateSchedule
            }
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteSchedule && (
          <DeleteScheduleModal
            schedule={deleteSchedule}
            onClose={() => setDeleteSchedule(null)}
            onConfirm={handleDeleteSchedule}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailItem && (
          <TicketDetailModal
            item={detailItem.item}
            itemType={detailItem.type}
            onClose={() => setDetailItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
