"use client";

import { TableColumn } from "@/components/Table";
import { formatDate } from "@/helpers/format.helpers";
import type { TicketSchedule, TicketPurchase } from "@/api/dashboard/types/dashboard.api";
import { ShoppingCart, Eye } from "lucide-react";

export interface DashboardScheduleColumnsOptions {
  onPurchase?: (schedule: TicketSchedule) => void;
  purchasingId?: number | null;
  onView?: (row: TicketSchedule) => void;
}

export interface PurchaseColumnsOptions {
  onView?: (row: TicketPurchase) => void;
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
          className={`px-2 py-1 text-xs font-semibold rounded-full ${row.can_be_purchased
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
            }`}
        >
          {row.can_be_purchased ? "হ্যাঁ" : "না"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "কার্যক্রম",
      render: (row: TicketSchedule) => {
        const isPurchasing = options?.purchasingId === row.id;
        return (
          <div className="flex items-center gap-3">
            {row.can_be_purchased && options?.onPurchase && (
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

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                options?.onView?.(row);
              }}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 transition-colors"
              title="বিস্তারিত দেখুন"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        );
      },
    } as TableColumn<TicketSchedule>,
  ];

export const getPurchaseColumns = (
  options?: PurchaseColumnsOptions
): TableColumn<TicketPurchase>[] => [
    {
      key: "id",
      label: "ক্রয় আইডি",
      className: "font-mono text-gray-600",
    },
    {
      key: "user_name",
      label: "ব্যবহারকারী",
      render: (row) => (
        <span className="font-medium text-gray-900">{row.user_name}</span>
      ),
    },
    {
      key: "ticket_title",
      label: "টিকেট",
      render: (row) => (
        <span
          className="font-semibold text-gray-900 max-w-[200px] truncate block"
          title={row.ticket.title}
        >
          {row.ticket.title}
        </span>
      ),
    },
    {
      key: "purchase_price",
      label: "ক্রয় মূল্য",
      render: (row) => (
        <span className="font-medium">
          ৳ {Number(row.purchase_price).toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "profit_amount",
      label: "লাভের পরিমাণ",
      render: (row) => (
        <span className="font-medium text-green-700">
          ৳ {Number(row.profit_amount).toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "profit_added",
      label: "লাভ যোগ হয়েছে",
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${row.profit_added
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {row.profit_added ? "হ্যাঁ" : "না"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "ক্রয়ের তারিখ",
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "actions",
      label: "কার্যক্রম",
      render: (row: TicketPurchase) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            options?.onView?.(row);
          }}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 transition-colors"
          title="বিস্তারিত দেখুন"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    } as TableColumn<TicketPurchase>,
  ];
