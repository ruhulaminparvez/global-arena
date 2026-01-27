"use client";

import { TableColumn } from "@/components/Table";

type Deposit = {
  id: number;
  userName: string;
  amount: number;
  method: string;
  date: string;
  status: string;
};

export const getDepositsColumns = (): TableColumn<Deposit>[] => [
  { key: "id", label: "আইডি" },
  { key: "userName", label: "ব্যবহারকারীর নাম" },
  {
    key: "amount",
    label: "পরিমাণ",
    render: (deposit) => (
      <span className="font-semibold">
        ৳ {deposit.amount.toLocaleString("bn-BD")}
      </span>
    ),
  },
  { key: "method", label: "পদ্ধতি", className: "text-gray-600" },
  { key: "date", label: "তারিখ", className: "text-gray-600" },
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
    key: "actions",
    label: "কার্যক্রম",
    render: () => (
      <div className="flex gap-2">
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          দেখুন
        </button>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          অনুমোদন
        </button>
        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
          প্রত্যাখ্যান
        </button>
      </div>
    ),
  },
];
