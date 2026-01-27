"use client";

import UserDetail from "./_components/UserDetail";
import MonthlySavingsGraph from "./_components/MonthlySavingsGraph";
import BottomNavigation from "./_components/BottomNavigation";
import { DASHBOARD_STATS } from "@/constants/dashboard";
import { motion } from "framer-motion";

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[15.5rem] sm:pb-[10.5rem] overflow-x-hidden">
        <UserDetail />

        {/* Card Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {DASHBOARD_STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-6">
          <MonthlySavingsGraph />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
