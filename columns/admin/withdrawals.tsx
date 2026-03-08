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
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    case "approved":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "rejected":
      return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
    default:
      return "bg-white/10 text-slate-300 border border-white/20";
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
    { key: "id", label: "আইডি", className: "font-mono text-slate-400" },
    { key: "user", label: "ব্যবহারকারী", className: "font-medium text-white" },
    {
      key: "amount",
      label: "পরিমাণ",
      render: (withdrawal) => (
        <span className="font-semibold text-white">
          ৳ {parseFloat(withdrawal.amount || "0").toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "তারিখ",
      render: (withdrawal) => (
        <span className="text-slate-400">
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
            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
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
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
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
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-rose-500/30 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
              >
                প্রত্যাখ্যান
              </button>
            )}
          </div>
        ) : (
          <span className="text-slate-500 text-sm">—</span>
        ),
    },
  ];
}
