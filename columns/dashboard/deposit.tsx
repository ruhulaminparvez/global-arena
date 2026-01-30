"use client";

import { TableColumn } from "@/components/Table";
import { cn } from "@/lib/utils";
import type { Deposit } from "@/api/dashboard/types/dashboard.api";

function statusBadgeClass(status: string): string {
  const normalized = String(status ?? "").toLowerCase().trim();
  switch (normalized) {
    case "pending":
      return "bg-orange-100 text-orange-800 border border-orange-300";
    case "approved":
      return "bg-green-100 text-green-800 border border-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 border border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export interface DepositColumnsOptions {
  formatDate?: (dateString: string) => string;
  onApprove?: (deposit: Deposit) => void;
  isSupport?: boolean;
}

export const getDepositColumns = (
  options: DepositColumnsOptions = {}
): TableColumn<Deposit>[] => {
  const {
    formatDate: formatDateProp,
    onApprove,
    isSupport,
  } = options;
  const format = formatDateProp ?? formatDate;

  return [
    { key: "id", label: "আইডি", className: "font-medium" },
    {
      key: "amount",
      label: "পরিমাণ",
      render: (deposit) => (
        <span className="font-semibold">
          ৳ {parseFloat(deposit.amount || "0").toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "তারিখ",
      render: (deposit) => (
        <span className="text-gray-600">{format(deposit.created_at)}</span>
      ),
    },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (deposit) => (
        <span
          className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full",
            statusBadgeClass(deposit?.status ?? "")
          )}
        >
          {deposit.status_display}
        </span>
      ),
    },
    ...(isSupport && onApprove
      ? [
        {
          key: "action",
          label: "কার্যকর",
          render: (deposit: Deposit) =>
            deposit.status === "PENDING" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(deposit);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm border border-green-600 bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                অনুমোদন
              </button>
            ) : (
              <span className="text-gray-400 text-sm">—</span>
            ),
        } as TableColumn<Deposit>,
      ]
      : []),
  ];
};
