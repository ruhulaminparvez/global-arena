"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DASHBOARD_STATS } from "@/constants/dashboard";
import { LucideIcon } from "lucide-react";

// Counter animation hook with smooth, realistic increment
function useCounterAnimation(targetValue: number, duration: number = 4500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const delay = 400; // Longer delay before starting for better UX

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      // Wait for delay before starting
      if (elapsed < delay) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const adjustedElapsed = elapsed - delay;
      const progress = Math.min(adjustedElapsed / duration, 1);

      // Use easeOutCubic for smoother, more natural deceleration
      // This creates a cleaner, more realistic counting effect
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      // Calculate the current count value
      const currentCount = targetValue * easeOutCubic;

      // Use Math.round for smoother increments
      setCount(Math.round(currentCount));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Ensure we end exactly at target value
        setCount(targetValue);
      }
    };

    // Reset to 0 when target changes
    setCount(0);
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, duration]);

  return count;
}

// Extract numeric value from string like "৳ 85,000" or "12"
function extractNumericValue(value: string): number {
  // Remove currency symbol, spaces, and commas, then parse
  const numericString = value.replace(/[৳,\s]/g, "");
  return parseInt(numericString, 10) || 0;
}

// Format number with currency symbol for display
function formatValue(value: string, animatedCount: number): string {
  const originalValue = value.trim();

  // Check if it's a currency value (starts with ৳)
  if (originalValue.startsWith("৳")) {
    return `৳ ${animatedCount.toLocaleString("bn-BD")}`;
  }

  // For non-currency values (like ticket count)
  return animatedCount.toString();
}

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
