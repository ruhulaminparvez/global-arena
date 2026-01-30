"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWalletTransactions } from "@/api/dashboard/dashboard.api";
import type { WalletTransaction } from "@/api/dashboard/types/dashboard.api";

interface ChartDataPoint {
  month: string;
  amount: number;
}

function groupTransactionsByMonth(
  transactions: WalletTransaction[]
): ChartDataPoint[] {
  const byMonth = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== "DEPOSIT") continue;
    const date = new Date(tx.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("bn-BD", {
      month: "short",
      year: "numeric",
    });
    const amount = parseFloat(tx.amount || "0");
    byMonth.set(key, (byMonth.get(key) ?? 0) + amount);
  }

  const entries = Array.from(byMonth.entries())
    .map(([key, amount]) => {
      const [y, m] = key.split("-");
      const date = new Date(Number(y), Number(m) - 1);
      const month = date.toLocaleDateString("bn-BD", {
        month: "short",
        year: "numeric",
      });
      return { month, amount, sortKey: key };
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return entries.map(({ month, amount }) => ({ month, amount }));
}

export default function MonthlySavingsGraph() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getWalletTransactions()
      .then((data) => {
        if (!cancelled) setTransactions(data);
      })
      .catch(() => {
        if (!cancelled) setTransactions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(
    () => groupTransactionsByMonth(transactions),
    [transactions]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-6 overflow-x-hidden"
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        মাসিক সঞ্চয় গ্রাফ
      </h3>
      <div className="h-80 w-full overflow-x-auto">
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-500">
            লোড হচ্ছে...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500">
            কোন লেনদেন নেই
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}K` : String(value)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  `${Number(value).toLocaleString("bn-BD")} ৳`,
                  "সঞ্চয়",
                ]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
