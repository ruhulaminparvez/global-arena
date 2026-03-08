"use client";

import { TableColumn } from "@/components/Table";
import { formatDate } from "@/helpers/format.helpers";
import type { TicketPurchase, TicketSchedule } from "@/api/admin/types/admin.api";
import { Eye, Pencil, Trash2 } from "lucide-react";

export interface ScheduleColumnsOptions {
  onEdit?: (schedule: TicketSchedule) => void;
  onDelete?: (schedule: TicketSchedule) => void;
  onViewDetail?: (schedule: TicketSchedule) => void;
}

export const getScheduleColumns = (
  options?: ScheduleColumnsOptions
): TableColumn<TicketSchedule>[] => [
    {
      key: "id",
      label: "আইডি",
      className: "font-mono text-slate-400",
    },
    {
      key: "title",
      label: "শিরোনাম",
      render: (row) => (
        <span className="font-semibold text-white max-w-[200px] truncate block" title={row.title}>
          {row.title}
        </span>
      ),
    },
    {
      key: "price",
      label: "মূল্য",
      render: (row) => (
        <span className="font-medium text-white">
          ৳ {Number(row.price).toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "profit_percentage",
      label: "লাভ %",
      render: (row) => <span className="text-emerald-400 font-medium">{row.profit_percentage}%</span>,
    },
    {
      key: "agreement_type_display",
      label: "চুক্তির ধরন",
      className: "text-slate-300 font-medium",
    },
    {
      key: "max_tickets",
      label: "সর্বোচ্চ টিকেট",
      className: "text-slate-300 font-medium",
    },
    {
      key: "total_purchases",
      label: "ক্রয়",
      render: (row) => (
        <span className="text-slate-400 font-medium">{row.total_purchases}</span>
      ),
    },
    {
      key: "event_date",
      label: "ইভেন্ট তারিখ",
      render: (row) => <span className="text-slate-400 font-medium">{formatDate(row.event_date)}</span>,
    },
    {
      key: "is_active",
      label: "সক্রিয়",
      render: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${row.is_active ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/10 text-slate-400 border-white/20"
            }`}
        >
          {row.is_active ? "হ্যাঁ" : "না"}
        </span>
      ),
    },
    {
      key: "is_announced",
      label: "ঘোষিত",
      render: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${row.is_announced ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-white/10 text-slate-400 border-white/20"
            }`}
        >
          {row.is_announced ? "হ্যাঁ" : "না"}
        </span>
      ),
    },
    ...(options?.onEdit || options?.onDelete || options?.onViewDetail
      ? [
        {
          key: "actions",
          label: "কার্যক্রম",
          render: (row: TicketSchedule) => (
            <div className="flex gap-2">
              {options?.onViewDetail && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onViewDetail?.(row);
                  }}
                  className="p-2 text-primary-400 hover:bg-white/10 rounded-xl transition-colors"
                  title="বিস্তারিত দেখুন"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {options?.onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onEdit?.(row);
                  }}
                  className="p-2 text-emerald-400 hover:bg-white/10 rounded-xl transition-colors"
                  title="সম্পাদনা"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {options?.onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onDelete?.(row);
                  }}
                  className="p-2 text-rose-400 hover:bg-white/10 rounded-xl transition-colors"
                  title="মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ),
        } as TableColumn<TicketSchedule>,
      ]
      : []),
  ];

export const getPurchaseColumns = (options?: {
  onViewDetail?: (purchase: TicketPurchase) => void;
}): TableColumn<TicketPurchase>[] => [
    {
      key: "id",
      label: "আইডি",
      className: "font-mono text-slate-400",
    },
    {
      key: "user_name",
      label: "ব্যবহারকারী",
      render: (row) => (
        <span className="font-medium text-white">{row.user_name}</span>
      ),
    },
    {
      key: "ticket",
      label: "টিকেট",
      render: (row) => (
        <span className="font-semibold text-white max-w-[200px] truncate block" title={row.ticket.title}>
          {row.ticket.title}
        </span>
      ),
    },
    {
      key: "purchase_price",
      label: "মূল্য",
      render: (row) => (
        <span className="font-medium text-white">
          ৳ {Number(row.purchase_price).toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "profit_amount",
      label: "লাভ",
      render: (row) => (
        <span className="font-medium text-emerald-400">
          ৳ {Number(row.profit_amount).toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "profit_added",
      label: "লাভ যোগ",
      render: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${row.profit_added ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/10 text-slate-400 border-white/20"
            }`}
        >
          {row.profit_added ? "হ্যাঁ" : "না"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "ক্রয়ের তারিখ",
      render: (row) => <span className="text-slate-400 font-medium">{formatDate(row.created_at)}</span>,
    },
    ...(options?.onViewDetail
      ? [
        {
          key: "actions",
          label: "কার্যক্রম",
          render: (row: TicketPurchase) => (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                options.onViewDetail?.(row);
              }}
              className="p-2 text-primary-400 hover:bg-white/10 rounded-xl transition-colors"
              title="বিস্তারিত দেখুন"
            >
              <Eye className="w-4 h-4" />
            </button>
          ),
        } as TableColumn<TicketPurchase>,
      ]
      : []),
  ];
