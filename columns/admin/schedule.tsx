"use client";

import { TableColumn } from "@/components/Table";
import { formatDate } from "@/helpers/format.helpers";
import type { TicketSchedule } from "@/api/admin/types/admin.api";
import { Pencil, Trash2 } from "lucide-react";

export interface ScheduleColumnsOptions {
  onEdit?: (schedule: TicketSchedule) => void;
  onDelete?: (schedule: TicketSchedule) => void;
}

export const getScheduleColumns = (
  options?: ScheduleColumnsOptions
): TableColumn<TicketSchedule>[] => [
    {
      key: "id",
      label: "আইডি",
      className: "font-mono text-gray-600",
    },
    {
      key: "title",
      label: "শিরোনাম",
      render: (row) => (
        <span className="font-semibold text-gray-900 max-w-[200px] truncate block" title={row.title}>
          {row.title}
        </span>
      ),
    },
    {
      key: "price",
      label: "মূল্য",
      render: (row) => (
        <span className="font-medium">
          ৳ {Number(row.price).toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "profit_percentage",
      label: "লাভ %",
      render: (row) => `${row.profit_percentage}%`,
    },
    {
      key: "agreement_type_display",
      label: "চুক্তির ধরন",
    },
    {
      key: "max_tickets",
      label: "সর্বোচ্চ টিকেট",
    },
    {
      key: "total_purchases",
      label: "ক্রয়",
      render: (row) => (
        <span className="text-gray-600">{row.total_purchases}</span>
      ),
    },
    {
      key: "event_date",
      label: "ইভেন্ট তারিখ",
      render: (row) => formatDate(row.event_date),
    },
    {
      key: "is_active",
      label: "সক্রিয়",
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${row.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
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
          className={`px-2 py-1 text-xs font-semibold rounded-full ${row.is_announced ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
            }`}
        >
          {row.is_announced ? "হ্যাঁ" : "না"}
        </span>
      ),
    },
    ...(options?.onEdit || options?.onDelete
      ? [
        {
          key: "actions",
          label: "কার্যক্রম",
          render: (row: TicketSchedule) => (
            <div className="flex gap-2">
              {options?.onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onEdit?.(row);
                  }}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
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
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
