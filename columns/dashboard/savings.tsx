"use client";

import { TableColumn } from "@/components/Table";
import type { SavingPlan, SavingTransaction } from "@/api/admin/types/admin.api";
import { formatDate } from "@/helpers/format.helpers";

/** Columns for List Saving Plans & My Plans tables (dashboard) */
export const getSavingsPlanColumns = (): TableColumn<SavingPlan>[] => [
  { key: "id", label: "আইডি", className: "font-medium" },
  {
    key: "monthly_amount",
    label: "মাসিক পরিমাণ",
    render: (row) => (
      <span className="font-semibold">
        ৳ {parseFloat(row.monthly_amount).toLocaleString("bn-BD")}
      </span>
    ),
  },
  {
    key: "duration_months",
    label: "মেয়াদ (মাস)",
    render: (row) => <span>{row.duration_months}</span>,
  },
  {
    key: "start_date",
    label: "শুরুর তারিখ",
    render: (row) => (
      <span className="text-gray-600">{row.start_date}</span>
    ),
  },
  {
    key: "total_saved",
    label: "মোট সঞ্চয়",
    render: (row) => (
      <span className="font-semibold">
        ৳ {row.total_saved.toLocaleString("bn-BD")}
      </span>
    ),
  },
  {
    key: "months_remaining",
    label: "বাকি মাস",
    render: (row) => <span>{row.months_remaining}</span>,
  },
  {
    key: "is_completed",
    label: "সম্পন্ন",
    render: (row) => (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          row.is_completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
        }`}
      >
        {row.is_completed ? "হ্যাঁ" : "না"}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "তৈরির তারিখ",
    render: (row) => (
      <span className="text-gray-600 text-sm">
        {row.created_at ? formatDate(row.created_at) : "—"}
      </span>
    ),
  },
];

/** Columns for Plan Transactions detail table */
export const getSavingsTransactionColumns = (): TableColumn<SavingTransaction>[] => [
  { key: "id", label: "আইডি" },
  {
    key: "amount",
    label: "পরিমাণ",
    render: (row) => (
      <span className="font-semibold">
        ৳{" "}
        {row.amount != null
          ? parseFloat(String(row.amount)).toLocaleString("bn-BD")
          : "—"}
      </span>
    ),
  },
  {
    key: "transaction_date",
    label: "লেনদেনের তারিখ",
    render: (row) => (
      <span className="text-gray-600">
        {row.transaction_date ?? "—"}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "তৈরির তারিখ",
    render: (row) => (
      <span className="text-gray-600 text-sm">
        {row.created_at ? formatDate(row.created_at) : "—"}
      </span>
    ),
  },
];
