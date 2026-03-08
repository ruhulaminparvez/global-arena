"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { extractNumericValue, formatValue } from "@/helpers/format.helpers";

interface AdminStatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

function AdminStatCard({ label, value, icon: Icon, color, index }: AdminStatCardProps) {
  const numericValue = extractNumericValue(value);
  // Slower animation with staggered delays for each card
  const animatedValue = useCounterAnimation(numericValue, 4500 + index * 300);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1"
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/40 to-white/0 rounded-full blur-2xl z-0 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-${color.split('-')[1]}-500/20`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        <h3 className="text-slate-400 font-medium text-sm mb-1">{label}</h3>
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
      </div>
    </motion.div>
  );
}

interface AdminStatsCardsProps {
  stats: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
  }>;
}

export default function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <AdminStatCard
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
