"use client";

import { TableColumn } from "@/components/Table";
import type { Deposit } from "@/constants/dashboard";

interface DepositColumnsProps {
  formatDate: (dateString: string) => string;
}

export const getDepositColumns = ({
  formatDate,
}: DepositColumnsProps): TableColumn<Deposit>[] => [
    {
      key: "id",
      label: "আইডি",
      className: "font-medium",
    },
    {
      key: "date",
      label: "তারিখ",
      render: (deposit) => formatDate(deposit.date),
    },
    {
      key: "amount",
      label: "পরিমাণ",
      render: (deposit) => (
        <span className="font-semibold">
          ৳ {deposit.amount.toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "method",
      label: "পদ্ধতি",
      className: "text-gray-600",
    },
    {
      key: "transactionId",
      label: "ট্রান্সাকশন আইডি",
      render: (deposit) => (
        <span className="font-mono text-gray-600">{deposit.transactionId}</span>
      ),
    },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (deposit) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${deposit.status === "অনুমোদিত"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {deposit.status}
        </span>
      ),
    },
    {
      key: "description",
      label: "বিবরণ",
      render: (deposit) => (
        <span className="text-gray-600">{deposit.description || "-"}</span>
      ),
    },
  ];
