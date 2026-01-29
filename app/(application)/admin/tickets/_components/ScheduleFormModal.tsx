"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import type {
  TicketSchedule,
  TicketSchedulePayload,
  AgreementType,
} from "@/api/admin/types/admin.api";

/** Convert ISO string to datetime-local value (YYYY-MM-DDTHH:mm) */
function toDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert datetime-local value to ISO string */
function fromDatetimeLocal(value: string): string {
  if (!value) return "";
  return new Date(value).toISOString();
}

const AGREEMENT_OPTIONS: { value: AgreementType; label: string }[] = [
  { value: "LONG", label: "Long Term" },
  { value: "SHORT", label: "Short Term" },
];

export interface ScheduleFormModalProps {
  mode: "create" | "update";
  schedule?: TicketSchedule | null;
  onClose: () => void;
  onSubmit: (payload: TicketSchedulePayload) => Promise<void>;
}

const initialPayload: TicketSchedulePayload = {
  title: "",
  description: "",
  announcement_text: "",
  price: 0,
  profit_percentage: 0,
  agreement_type: "LONG",
  duration_days: 0,
  announcement_date: "",
  drop_time: "",
  event_date: "",
  is_active: true,
  is_confirmed: false,
  is_announced: false,
  max_tickets: 0,
};

export function ScheduleFormModal({
  mode,
  schedule,
  onClose,
  onSubmit,
}: ScheduleFormModalProps) {
  const [form, setForm] = useState<TicketSchedulePayload>(initialPayload);
  const [errors, setErrors] = useState<Partial<Record<keyof TicketSchedulePayload, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "update" && schedule) {
      setForm({
        title: schedule.title,
        description: schedule.description,
        announcement_text: schedule.announcement_text,
        price: Number(schedule.price),
        profit_percentage: Number(schedule.profit_percentage),
        agreement_type: schedule.agreement_type,
        duration_days: schedule.duration_days,
        announcement_date: schedule.announcement_date,
        drop_time: schedule.drop_time,
        event_date: schedule.event_date,
        is_active: schedule.is_active,
        is_confirmed: schedule.is_confirmed,
        is_announced: schedule.is_announced,
        max_tickets: schedule.max_tickets,
      });
    } else {
      setForm(initialPayload);
    }
    setErrors({});
  }, [mode, schedule]);

  const update = (key: keyof TicketSchedulePayload, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof TicketSchedulePayload, string>> = {};
    if (!form.title.trim()) next.title = "শিরোনাম আবশ্যক";
    if (!form.description.trim()) next.description = "বিবরণ আবশ্যক";
    if (form.price <= 0) next.price = "মূল্য ০ এর চেয়ে বড় হতে হবে";
    if (form.profit_percentage < 0) next.profit_percentage = "লাভ শতাংশ বৈধ হতে হবে";
    if (form.duration_days <= 0) next.duration_days = "মেয়াদ (দিন) আবশ্যক";
    if (!form.announcement_date) next.announcement_date = "ঘোষণার তারিখ আবশ্যক";
    if (!form.drop_time) next.drop_time = "ড্রপ টাইম আবশ্যক";
    if (!form.event_date) next.event_date = "ইভেন্ট তারিখ আবশ্যক";
    if (form.max_tickets <= 0) next.max_tickets = "সর্বোচ্চ টিকেট সংখ্যা আবশ্যক";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload: TicketSchedulePayload = {
        ...form,
        announcement_date: form.announcement_date.includes("T")
          ? new Date(form.announcement_date).toISOString()
          : `${form.announcement_date}T00:00:00Z`,
        drop_time: form.drop_time.includes("T")
          ? new Date(form.drop_time).toISOString()
          : `${form.drop_time}T00:00:00Z`,
        event_date: form.event_date.includes("T")
          ? new Date(form.event_date).toISOString()
          : `${form.event_date}T00:00:00Z`,
      };
      await onSubmit(payload);
      onClose();
    } catch {
      setErrors({ title: "সাবমিট ব্যর্থ। আবার চেষ্টা করুন।" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "create" ? "সিডিউল তৈরি করুন" : "সিডিউল আপডেট করুন";

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
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
      >
        <div className="shrink-0 bg-primary-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <Input
              label="শিরোনাম"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              error={errors.title}
              placeholder="উদাহরণ: Hajj 2026 Package"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">বিবরণ</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="প্যাকেজের বিবরণ"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            <Input
              label="ঘোষণা টেক্সট"
              value={form.announcement_text}
              onChange={(e) => update("announcement_text", e.target.value)}
              placeholder="Early bird registration now open!"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="মূল্য"
                type="number"
                min={0}
                step={0.01}
                value={form.price || ""}
                onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
                error={errors.price}
              />
              <Input
                label="লাভ শতাংশ (%)"
                type="number"
                min={0}
                step={0.01}
                value={form.profit_percentage ?? ""}
                onChange={(e) =>
                  update("profit_percentage", parseFloat(e.target.value) ?? 0)
                }
                error={errors.profit_percentage}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  চুক্তির ধরন
                </label>
                <select
                  value={form.agreement_type}
                  onChange={(e) => update("agreement_type", e.target.value as AgreementType)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {AGREEMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="মেয়াদ (দিন)"
                type="number"
                min={1}
                value={form.duration_days || ""}
                onChange={(e) => update("duration_days", parseInt(e.target.value, 10) || 0)}
                error={errors.duration_days}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ঘোষণার তারিখ
                </label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.announcement_date)}
                  onChange={(e) =>
                    update("announcement_date", fromDatetimeLocal(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.announcement_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.announcement_date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ড্রপ টাইম
                </label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.drop_time)}
                  onChange={(e) =>
                    update("drop_time", fromDatetimeLocal(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.drop_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.drop_time}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ইভেন্ট তারিখ
                </label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.event_date)}
                  onChange={(e) =>
                    update("event_date", fromDatetimeLocal(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.event_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>
                )}
              </div>
            </div>
            <Input
              label="সর্বোচ্চ টিকেট"
              type="number"
              min={1}
              value={form.max_tickets || ""}
              onChange={(e) => update("max_tickets", parseInt(e.target.value, 10) || 0)}
              error={errors.max_tickets}
            />
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => update("is_active", e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">সক্রিয়</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_confirmed}
                  onChange={(e) => update("is_confirmed", e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">নিশ্চিত</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_announced}
                  onChange={(e) => update("is_announced", e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">ঘোষিত</span>
              </label>
            </div>
          </div>
          <div className="shrink-0 flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {mode === "create" ? "তৈরি করুন" : "আপডেট করুন"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
