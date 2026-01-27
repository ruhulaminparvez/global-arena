"use client";

import { TableColumn } from "@/components/Table";
import type { Withdrawal } from "@/constants/dashboard";

interface WithdrawalColumnsProps {
  formatDate: (dateString: string) => string;
}

export const getWithdrawalColumns = ({
  formatDate,
}: WithdrawalColumnsProps): TableColumn<Withdrawal>[] => [
    {
      key: "id",
      label: "আইডি",
      className: "font-medium",
    },
    {
      key: "date",
      label: "তারিখ",
      render: (withdrawal) => formatDate(withdrawal.date),
    },
    {
      key: "amount",
      label: "পরিমাণ",
      render: (withdrawal) => (
        <span className="font-semibold">
          ৳ {withdrawal.amount.toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "method",
      label: "পদ্ধতি",
      className: "text-gray-600",
    },
    {
      key: "accountNumber",
      label: "অ্যাকাউন্ট নম্বর",
      render: (withdrawal) => (
        <span className="font-mono text-gray-600">{withdrawal.accountNumber}</span>
      ),
    },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (withdrawal) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${withdrawal.status === "অনুমোদিত"
            ? "bg-green-100 text-green-800"
            : withdrawal.status === "প্রত্যাখ্যান"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {withdrawal.status}
        </span>
      ),
    },
    {
      key: "description",
      label: "বিবরণ",
      render: (withdrawal) => (
        <span className="text-gray-600">{withdrawal.description || "-"}</span>
      ),
    },
  ];
