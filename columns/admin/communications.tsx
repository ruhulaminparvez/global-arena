"use client";

import { Send } from "lucide-react";
import { TableColumn } from "@/components/Table";

type Communication = {
  id: number;
  title: string;
  type: string;
  recipients: string;
  date: string;
  status: string;
};

export const getCommunicationsColumns = (): TableColumn<Communication>[] => [
  { key: "id", label: "আইডি" },
  { key: "title", label: "শিরোনাম", className: "font-medium" },
  { key: "type", label: "ধরন", className: "text-gray-600" },
  { key: "recipients", label: "প্রাপক", className: "text-gray-600" },
  { key: "date", label: "তারিখ", className: "text-gray-600" },
  {
    key: "status",
    label: "স্ট্যাটাস",
    render: (comm) => (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${comm.status === "প্রেরিত"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
          }`}
      >
        {comm.status}
      </span>
    ),
  },
  {
    key: "actions",
    label: "কার্যক্রম",
    render: (comm) => (
      <div className="flex gap-2">
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          দেখুন
        </button>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          সম্পাদনা
        </button>
        {comm.status === "খসড়া" && (
          <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
            <Send className="w-3 h-3" />
            প্রেরণ
          </button>
        )}
      </div>
    ),
  },
];
