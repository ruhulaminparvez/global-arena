"use client";

import { TableColumn } from "@/components/Table";

type Investment = {
  id: number;
  userName: string;
  amount: number;
  type: string;
  date: string;
  status: string;
};

export const getInvestmentsColumns = (): TableColumn<Investment>[] => [
  { key: "id", label: "আইডি" },
  { key: "userName", label: "ব্যবহারকারীর নাম" },
  {
    key: "amount",
    label: "পরিমাণ",
    render: (investment) => (
      <span className="font-semibold">
        ৳ {investment.amount.toLocaleString("bn-BD")}
      </span>
    ),
  },
  { key: "type", label: "ধরন", className: "text-gray-600" },
  { key: "date", label: "তারিখ", className: "text-gray-600" },
  {
    key: "status",
    label: "স্ট্যাটাস",
    render: (investment) => (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${investment.status === "সক্রিয়"
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
          }`}
      >
        {investment.status}
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
          সম্পাদনা
        </button>
      </div>
    ),
  },
];
