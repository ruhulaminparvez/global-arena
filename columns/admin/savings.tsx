"use client";

import { TableColumn } from "@/components/Table";
import type { SavingPlan, SavingTransaction } from "@/api/admin/types/admin.api";
import { formatDate } from "@/helpers/format.helpers";

export const getSavingsPlanColumns = (): TableColumn<SavingPlan>[] => [
  { key: "id", label: "আইডি" },
  {
    key: "user",
    label: "ব্যবহারকারী",
    render: (row) => (
      <span className="font-medium">User #{row.user}</span>
    ),
  },
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
  {
    key: "actions",
    label: "কার্যক্রম",
    render: () => (
      <div className="flex gap-2">
        <button
          type="button"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          দেখুন
        </button>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          সম্পাদনা
        </button>
      </div>
    ),
  },
];

export const getSavingsTransactionColumns = (): TableColumn<SavingTransaction>[] => [
  { key: "id", label: "আইডি" },
  {
    key: "plan",
    label: "প্ল্যান",
    render: (row) => (
      <span className="font-medium">
        {row.plan != null ? `#${row.plan}` : "—"}
      </span>
    ),
  },
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
  {
    key: "actions",
    label: "কার্যক্রম",
    render: () => (
      <div className="flex gap-2">
        <button
          type="button"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          দেখুন
        </button>
      </div>
    ),
  },
];

// Legacy: kept for backward compatibility if used elsewhere
type Saving = {
  id: number;
  userName: string;
  amount: number;
  date: string;
  status: string;
};

export const getSavingsColumns = (): TableColumn<Saving>[] => [
  { key: "id", label: "আইডি" },
  { key: "userName", label: "ব্যবহারকারীর নাম" },
  {
    key: "amount",
    label: "পরিমাণ",
    render: (saving) => (
      <span className="font-semibold">
        ৳ {saving.amount.toLocaleString("bn-BD")}
      </span>
    ),
  },
  { key: "date", label: "তারিখ", className: "text-gray-600" },
  {
    key: "status",
    label: "স্ট্যাটাস",
    render: (saving) => (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        {saving.status}
      </span>
    ),
  },
  {
    key: "actions",
    label: "কার্যক্রম",
    render: () => (
      <div className="flex gap-2">
        <button
          type="button"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          দেখুন
        </button>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          সম্পাদনা
        </button>
      </div>
    ),
  },
];
