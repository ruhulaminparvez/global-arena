"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { dashboardRoutes, dashboardStats } from "@/utils/constants";
import Button from "@/components/ui/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Helper function to get normal border and hover background colors
const getCardColors = (colorClass: string) => {
  if (colorClass.includes("green")) {
    return {
      border: "border-green-200",
      hoverBg: "hover:bg-green-50",
      iconBg: "bg-green-100",
      iconHoverBg: "group-hover:bg-green-50",
    };
  }
  if (colorClass.includes("emerald")) {
    return {
      border: "border-emerald-200",
      hoverBg: "hover:bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconHoverBg: "group-hover:bg-emerald-50",
    };
  }
  if (colorClass.includes("teal")) {
    return {
      border: "border-teal-200",
      hoverBg: "hover:bg-teal-50",
      iconBg: "bg-teal-100",
      iconHoverBg: "group-hover:bg-teal-50",
    };
  }
  if (colorClass.includes("lime")) {
    return {
      border: "border-lime-200",
      hoverBg: "hover:bg-lime-50",
      iconBg: "bg-lime-100",
      iconHoverBg: "group-hover:bg-lime-50",
    };
  }
  return {
    border: "border-green-200",
    hoverBg: "hover:bg-green-50",
    iconBg: "bg-green-100",
    iconHoverBg: "group-hover:bg-green-50",
  };
};

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Global Arena
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Savings Platform for Farmers & Working People
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={false}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Savings Platform for Farmers & Working People
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial={false}
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            const cardColors = getCardColors(stat.color);
            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                initial={false}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`bg-white ${cardColors.hoverBg} rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${cardColors.border} group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${cardColors.iconBg} ${cardColors.iconHoverBg} ${stat.color} group-hover:scale-110 transition-all duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.trend && (
                    <span
                      className={`text-sm font-semibold ${
                        stat.trend.isPositive
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.trend.value}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors">
                  {stat.title}
                </h3>
                <p className={`text-2xl font-bold ${stat.color} group-hover:scale-105 transition-transform`}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Route Options */}
        <motion.div
          variants={containerVariants}
          initial={false}
          animate="visible"
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardRoutes.map((route) => {
              const Icon = route.icon;
              const cardColors = getCardColors(route.color);
              return (
                <motion.a
                  key={route.id}
                  href={route.href}
                  variants={itemVariants}
                  initial={false}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white ${cardColors.hoverBg} rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${cardColors.border} group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg ${cardColors.iconBg} ${cardColors.iconHoverBg} ${route.color} group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className={`text-xl font-bold ${route.color} mb-2 group-hover:scale-105 transition-transform`}>
                    {route.title}
                  </h4>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                    {route.description}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
