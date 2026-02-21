"use client";

import { motion } from "framer-motion";
import { X, Eye } from "lucide-react";
import { formatDate } from "@/helpers/format.helpers";
import type { TicketSchedule, TicketPurchase } from "@/api/admin/types/admin.api";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="text-sm text-gray-900 break-words">{value ?? "—"}</div>
    </div>
  );
}

function Badge({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
        value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
      }`}
    >
      {value ? "হ্যাঁ" : "না"}
    </span>
  );
}

function ScheduleDetailFields({ s }: { s: TicketSchedule }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="আইডি" value={s.id} />
      <Field label="শিরোনাম" value={s.title} />
      <Field label="বিবরণ" value={s.description} />
      <Field label="ঘোষণার টেক্সট" value={s.announcement_text || "—"} />
      <Field label="মূল্য" value={`৳ ${Number(s.price).toLocaleString()}`} />
      <Field label="লাভ %" value={`${s.profit_percentage}%`} />
      <Field label="লাভের পরিমাণ" value={`৳ ${Number(s.profit_amount).toLocaleString()}`} />
      <Field label="চুক্তির ধরন" value={s.agreement_type_display} />
      <Field label="মেয়াদ (দিন)" value={s.duration_days} />
      <Field label="সর্বোচ্চ টিকেট" value={s.max_tickets} />
      <Field label="মোট ক্রয়" value={s.total_purchases} />
      <Field label="ঘোষণার তারিখ" value={formatDate(s.announcement_date)} />
      <Field label="ড্রপ টাইম" value={formatDate(s.drop_time)} />
      <Field label="ইভেন্ট তারিখ" value={formatDate(s.event_date)} />
      <Field label="সক্রিয়" value={<Badge value={s.is_active} />} />
      <Field label="ঘোষিত" value={<Badge value={s.is_announced} />} />
      <Field label="নিশ্চিত" value={<Badge value={s.is_confirmed} />} />
      <Field label="উপলব্ধ" value={<Badge value={s.is_available} />} />
      <Field label="ক্রয়যোগ্য" value={<Badge value={s.can_be_purchased} />} />
      <Field label="তৈরির তারিখ" value={formatDate(s.created_at)} />
      <Field label="আপডেটের তারিখ" value={formatDate(s.updated_at)} />
    </div>
  );
}

interface Props {
  item: TicketSchedule | TicketPurchase | null;
  itemType: "schedule" | "purchase";
  onClose: () => void;
}

export function TicketDetailModal({ item, itemType, onClose }: Props) {
  if (!item) return null;

  const isPurchase = itemType === "purchase";
  const purchase = isPurchase ? (item as TicketPurchase) : null;
  const schedule = !isPurchase ? (item as TicketSchedule) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 text-primary-700">
            <Eye className="w-5 h-5" />
            <h3 className="text-lg font-bold">
              {isPurchase ? "ক্রয়ের বিবরণ" : "সিডিউলের বিবরণ"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {purchase && (
            <>
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-100">
                  ক্রয়ের তথ্য
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="আইডি" value={purchase.id} />
                  <Field label="ব্যবহারকারী আইডি" value={purchase.user} />
                  <Field label="ব্যবহারকারীর নাম" value={purchase.user_name} />
                  <Field
                    label="ক্রয় মূল্য"
                    value={`৳ ${Number(purchase.purchase_price).toLocaleString()}`}
                  />
                  <Field
                    label="লাভের পরিমাণ"
                    value={`৳ ${Number(purchase.profit_amount).toLocaleString()}`}
                  />
                  <Field label="লাভ যোগ" value={<Badge value={purchase.profit_added} />} />
                  <Field label="ক্রয়ের তারিখ" value={formatDate(purchase.created_at)} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-100">
                  টিকেটের তথ্য
                </h4>
                <ScheduleDetailFields s={purchase.ticket} />
              </div>
            </>
          )}
          {schedule && <ScheduleDetailFields s={schedule} />}
        </div>
      </motion.div>
    </motion.div>
  );
}
