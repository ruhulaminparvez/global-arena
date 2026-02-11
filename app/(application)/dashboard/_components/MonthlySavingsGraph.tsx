"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
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

interface TransactionPoint {
  date: string;
  amount: number;
  type: string;
  typeLabel: string;
  sortKey: string;
}

function groupTransactionsByMonth(
  transactions: WalletTransaction[]
): ChartDataPoint[] {
  const byMonth = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== "DEPOSIT") continue;
    const date = new Date(tx.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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

function allTransactionsToLineData(
  transactions: WalletTransaction[]
): TransactionPoint[] {
  return [...transactions]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((tx) => {
      const date = new Date(tx.created_at);
      const dateLabel = date.toLocaleDateString("bn-BD", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const typeLabel =
        tx.type === "DEPOSIT" ? "জমা" : tx.type === "WITHDRAWAL" ? "উত্তোলন" : tx.type;
      return {
        date: dateLabel,
        amount: parseFloat(tx.amount || "0"),
        type: tx.type,
        typeLabel,
        sortKey: tx.created_at,
      };
    });
}

// Shared chart style (matches previous graph design)
const CHART_STYLE = {
  grid: { strokeDasharray: "3 3" as const, stroke: "#e5e7eb" },
  axis: { stroke: "#6b7280", fontSize: "12px" as const },
  tooltip: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  line: {
    stroke: "#10b981",
    strokeWidth: 3,
    dot: { fill: "#10b981", r: 5 },
    activeDot: { r: 8 },
  },
  bar: { fill: "#10b981", radius: [4, 4, 0, 0] as [number, number, number, number] },
};

const TOOLTIP_PAYMENT_LINE = "বিকাশ/নগদ: 01622260086";

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  payload?: TransactionPoint | ChartDataPoint;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  valueLabel,
}: {
  active?: boolean;
  payload?: readonly TooltipPayloadItem[] | undefined;
  label?: string | number;
  valueLabel?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  const name =
    valueLabel ??
    (payload[0].payload && "typeLabel" in payload[0].payload
      ? (payload[0].payload as TransactionPoint).typeLabel
      : payload[0].name ?? "লেনদেন");
  return (
    <div
      className="px-3 py-2 shadow-md"
      style={{
        ...CHART_STYLE.tooltip,
      }}
    >
      {label != null && (
        <p className="font-medium text-gray-800">
          {typeof label === "number" ? String(label) : label}
        </p>
      )}
      <p className="text-gray-700">
        {name}: {Number(value).toLocaleString("bn-BD")} ৳
      </p>
      <p className="text-xs text-primary-500 border-t border-gray-100 mt-0.5">
        {TOOLTIP_PAYMENT_LINE}
      </p>
    </div>
  );
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

  const monthlyBarData = useMemo(
    () => groupTransactionsByMonth(transactions),
    [transactions]
  );

  const allTransactionsLineData = useMemo(
    () => allTransactionsToLineData(transactions),
    [transactions]
  );

  const hasAnyData = monthlyBarData.length > 0 || allTransactionsLineData.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-6 overflow-x-hidden"
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        মাসিক সঞ্চয় ও লেনদেন
      </h3>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          লোড হচ্ছে...
        </div>
      ) : !hasAnyData ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          কোন লেনদেন নেই
        </div>
      ) : (
        <div className="space-y-8">{/* All transactions – Line chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              সমস্ত লেনদেন (লাইন গ্রাফ)
            </h4>
            <div className="h-80 w-full overflow-x-auto">
              {allTransactionsLineData.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
                  কোন লেনদেন নেই
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                  <LineChart
                    data={allTransactionsLineData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid {...CHART_STYLE.grid} />
                    <XAxis
                      dataKey="date"
                      stroke={CHART_STYLE.axis.stroke}
                      style={{ fontSize: CHART_STYLE.axis.fontSize }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke={CHART_STYLE.axis.stroke}
                      style={{ fontSize: CHART_STYLE.axis.fontSize }}
                      tickFormatter={(value) =>
                        value >= 1000 ? `${value / 1000}K` : String(value)
                      }
                    />
                    <Tooltip
                      content={(props) => (
                        <ChartTooltipContent
                          active={props.active}
                          payload={props.payload}
                          label={props.label}
                        />
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={CHART_STYLE.line.stroke}
                      strokeWidth={CHART_STYLE.line.strokeWidth}
                      dot={CHART_STYLE.line.dot}
                      activeDot={CHART_STYLE.line.activeDot}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          {/* Monthly savings – Bar chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              মাসিক সঞ্চয় (বার গ্রাফ)
            </h4>
            <div className="h-80 w-full overflow-x-auto">
              {monthlyBarData.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
                  এই মাসে জমা লেনদেন নেই
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                  <BarChart data={monthlyBarData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid {...CHART_STYLE.grid} />
                    <XAxis
                      dataKey="month"
                      stroke={CHART_STYLE.axis.stroke}
                      style={{ fontSize: CHART_STYLE.axis.fontSize }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke={CHART_STYLE.axis.stroke}
                      style={{ fontSize: CHART_STYLE.axis.fontSize }}
                      tickFormatter={(value) =>
                        value >= 1000 ? `${value / 1000}K` : String(value)
                      }
                    />
                    <Tooltip
                      content={(props) => (
                        <ChartTooltipContent
                          active={props.active}
                          payload={props.payload}
                          label={props.label}
                          valueLabel="সঞ্চয়"
                        />
                      )}
                    />
                    <Bar
                      dataKey="amount"
                      fill={CHART_STYLE.bar.fill}
                      radius={CHART_STYLE.bar.radius}
                      name="সঞ্চয়"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
