"use client";

import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/button";
import type { TicketSchedule } from "@/api/admin/types/admin.api";

export interface DeleteScheduleModalProps {
  schedule: TicketSchedule | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteScheduleModal({
  schedule,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteScheduleModalProps) {
  if (!schedule) return null;

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
        className="w-full max-w-md rounded-2xl bg-accent-950 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 relative backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 text-rose-400 mb-4 pr-10">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <h3 className="text-lg font-bold text-white">সিডিউল মুছুন</h3>
        </div>
        <p className="text-slate-300 mb-6">
          আপনি কি নিশ্চিত যে &quot;<strong className="text-white">{schedule.title}</strong>&quot; সিডিউলটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting} className="border-white/10 hover:bg-white/5 text-slate-300">
            বাতিল
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isDeleting}
            className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30"
          >
            মুছুন
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
