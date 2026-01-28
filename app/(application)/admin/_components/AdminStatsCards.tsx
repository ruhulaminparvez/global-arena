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
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      <h3 className="text-gray-600 text-sm mb-2">{label}</h3>
      <motion.p
        key={animatedValue}
        initial={{ scale: 0.98, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className="text-2xl font-bold text-gray-900"
      >
        {formatValue(value, animatedValue)}
      </motion.p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
