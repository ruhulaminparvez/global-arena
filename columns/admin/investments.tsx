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
  { key: "id", label: "আইডি", className: "font-mono text-slate-400" },
  { key: "userName", label: "ব্যবহারকারীর নাম", className: "font-medium text-white" },
  {
    key: "amount",
    label: "পরিমাণ",
    render: (investment) => (
      <span className="font-semibold text-white">
        ৳ {investment.amount.toLocaleString("bn-BD")}
      </span>
    ),
  },
  { key: "type", label: "ধরন", className: "text-slate-400" },
  { key: "date", label: "তারিখ", className: "text-slate-400" },
  {
    key: "status",
    label: "স্ট্যাটাস",
    render: (investment) => (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full border ${investment.status === "সক্রিয়"
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
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
      <div className="flex gap-4">
        <button className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium">
          দেখুন
        </button>
        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
          সম্পাদনা
        </button>
      </div>
    ),
  },
];
