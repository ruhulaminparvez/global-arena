"use client";

import { TableColumn } from "@/components/Table";
import { formatDate } from "@/helpers/format.helpers";
import type { TicketSchedule } from "@/api/dashboard/types/dashboard.api";
import { ShoppingCart } from "lucide-react";

export interface DashboardScheduleColumnsOptions {
  onPurchase?: (schedule: TicketSchedule) => void;
  purchasingId?: number | null;
}

export const getDashboardScheduleColumns = (
  options?: DashboardScheduleColumnsOptions
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
      <span
        className="font-semibold text-gray-900 max-w-[200px] truncate block"
        title={row.title}
      >
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
    key: "can_be_purchased",
    label: "ক্রয় উপলব্ধ",
    render: (row) => (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.can_be_purchased
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.can_be_purchased ? "হ্যাঁ" : "না"}
      </span>
    ),
  },
  ...(options?.onPurchase
    ? [
        {
          key: "actions",
          label: "কার্যক্রম",
          render: (row: TicketSchedule) => {
            const isPurchasing = options.purchasingId === row.id;
            return (
              <div className="flex gap-2">
                {row.can_be_purchased && (
                  <button
                    type="button"
                    disabled={isPurchasing}
                    onClick={(e) => {
                      e.stopPropagation();
                      options.onPurchase?.(row);
                    }}
                    className="px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                    title="ক্রয় করুন"
                  >
                    {isPurchasing ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ক্রয় হচ্ছে...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        ক্রয় করুন
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          },
        } as TableColumn<TicketSchedule>,
      ]
    : []),
];
