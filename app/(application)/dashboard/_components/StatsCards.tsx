"use client";

import { motion } from "framer-motion";
import { DASHBOARD_STATS } from "@/constants/dashboard";
import { LucideIcon } from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { extractNumericValue, formatValue } from "@/helpers/format.helpers";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

function StatCard({ label, value, icon: Icon, color, index }: StatCardProps) {
  const numericValue = extractNumericValue(value);
  // Slower animation with staggered delays for each card
  const animatedValue = useCounterAnimation(numericValue, 4500 + index * 300);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-white/20 transition-all group hover:-translate-y-1"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      <h3 className="text-slate-400 text-sm mb-2 font-medium">{label}</h3>
      <motion.p
        key={animatedValue}
        initial={{ scale: 0.98, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className="text-3xl font-bold text-white tracking-tight"
      >
        {formatValue(value, animatedValue)}
      </motion.p>
    </motion.div>
  );
}

interface StatsCardsProps { }

export default function StatsCards({ }: StatsCardsProps = {}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {DASHBOARD_STATS.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          index={index}
        />
      ))}
    </div>
  );
}
