"use client";

import { TableColumn } from "@/components/Table";

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
