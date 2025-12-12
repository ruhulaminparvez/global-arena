"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MOCK_USER_DATA } from "@/constants/dashboard";
import type { MonthlySavingsData } from "@/types/dashboard";

export default function MonthlySavingsGraph() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-6 overflow-x-hidden"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">মাসিক সঞ্চয় গ্রাফ</h3>
      <div className="h-80 w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%" minWidth={300}>
          <LineChart data={MOCK_USER_DATA.monthlySavings}>
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
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value.toLocaleString("bn-BD")} ৳`, "সঞ্চয়"]}
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
      </div>
    </motion.div>
  );
}

