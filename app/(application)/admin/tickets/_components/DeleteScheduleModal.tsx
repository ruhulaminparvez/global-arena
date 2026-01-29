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
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 text-red-600 mb-4 pr-10">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <h3 className="text-lg font-bold">সিডিউল মুছুন</h3>
        </div>
        <p className="text-gray-600 mb-6">
          আপনি কি নিশ্চিত যে &quot;<strong>{schedule.title}</strong>&quot; সিডিউলটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            বাতিল
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            মুছুন
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
