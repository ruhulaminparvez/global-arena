"use client";

import { TableColumn } from "@/components/Table";
import type { Investment } from "@/constants/dashboard";

interface TotalInvestmentColumnsProps {
  formatDate: (dateString: string) => string;
}

export const getTotalInvestmentColumns = ({
  formatDate,
}: TotalInvestmentColumnsProps): TableColumn<Investment>[] => [
    {
      key: "id",
      label: "আইডি",
      className: "font-medium",
    },
    {
      key: "date",
      label: "তারিখ",
      render: (investment) => formatDate(investment.date),
    },
    {
      key: "amount",
      label: "পরিমাণ",
      render: (investment) => (
        <span className="font-semibold">
          ৳ {investment.amount.toLocaleString("bn-BD")}
        </span>
      ),
    },
    {
      key: "type",
      label: "ধরন",
      className: "text-gray-600",
    },
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
      key: "description",
      label: "বিবরণ",
      className: "text-gray-600",
    },
  ];
