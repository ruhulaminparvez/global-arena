"use client";

import { TableColumn } from "@/components/Table";
import { cn } from "@/lib/utils";
import type { Withdrawal } from "@/api/admin/types/admin.api";

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

export interface WithdrawalColumnsOptions {
  onView?: (withdrawal: Withdrawal) => void;
  onApprove?: (withdrawal: Withdrawal) => void;
  onReject?: (withdrawal: Withdrawal) => void;
}

export function getWithdrawalsColumns(
  options: WithdrawalColumnsOptions = {}
): TableColumn<Withdrawal>[] {
  const { onView, onApprove, onReject } = options;

  return [
    { key: "id", label: "আইডি" },
    { key: "user", label: "ব্যবহারকারী" },
    {
      key: "amount",
      label: "পরিমাণ",
      render: (withdrawal) => (
        <span className="font-semibold">
          ৳ {parseFloat(withdrawal.amount || "0").toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "তারিখ",
      render: (withdrawal) => (
        <span className="text-gray-600">
          {formatDate(withdrawal.created_at)}
        </span>
      ),
    },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (withdrawal) => (
        <span
          className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full",
            statusBadgeClass(withdrawal?.status ?? "")
          )}
        >
          {withdrawal.status_display}
        </span>
      ),
    },
    {
      key: "view",
      label: "দেখুন",
      render: (withdrawal) =>
        onView ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView(withdrawal);
            }}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            দেখুন
          </button>
        ) : null,
    },
    {
      key: "action",
      label: "কার্যকর",
      render: (withdrawal) =>
        withdrawal.status === "PENDING" && (onApprove || onReject) ? (
          <div className="flex flex-wrap gap-2">
            {onApprove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(withdrawal);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm border border-green-600 bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                অনুমোদন
              </button>
            )}
            {onReject && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(withdrawal);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm border border-red-600 bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                প্রত্যাখ্যান
              </button>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
    },
  ];
}
