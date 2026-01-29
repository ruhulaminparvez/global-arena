"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getDisplayName } from "@/helpers/format.helpers";

interface AdminHeaderProps { }

export default function AdminHeader({ }: AdminHeaderProps = {}) {
  const { profile } = useAuth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const displayName = getDisplayName(profile?.user);

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 mb-6 relative"
    >
      {/* Button Container */}
      <div className="absolute top-4 right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDashboardClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-blue-800 transition-all z-10"
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-blue-500/30 blur-xl -z-10 rounded-lg"
                ></motion.div>

                {/* Tooltip content */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                    <span>ড্যাশবোর্ডে যান</span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-0.5">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-900 to-gray-800 rotate-45 border-r border-b border-gray-700/50"></div>
                  </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Admin Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="relative group"
        >
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 opacity-75 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-300 animate-pulse"></div>

          {/* Animated gradient border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 p-[3px]"
          >
            <div className="w-full h-full rounded-full bg-white"></div>
          </motion.div>

          {/* Main badge container */}
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary-50 to-white p-[2px] shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden ring-4 ring-white/50">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full"
              >
                <Shield className="w-14 h-14 text-primary-600" />
              </motion.div>
            </div>
          </div>

          {/* Decorative dots */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 left-3 w-4 h-4 bg-primary-500 rounded-full ring-2 ring-white shadow-lg"
          ></motion.div>
        </motion.div>

        {/* Admin Details */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900"
          >
            অ্যাডমিন প্যানেল
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4"
          >
            <p className="text-sm font-medium">
              {displayName || "অ্যাডমিন"}
            </p>
          </motion.div>

          {/* Admin Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-6 text-white shadow-2xl w-full"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10 overflow-hidden rounded-2xl">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)",
                  backgroundSize: "28px 28px",
                  width: "200%",
                  height: "200%",
                }}
                animate={{
                  x: [0, -28],
                  y: [0, -28],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              ></motion.div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium opacity-90">অ্যাডমিন এক্সেস</p>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                >
                  <Shield className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Admin Title */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-2 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <Shield className="w-6 h-6" />
                </motion.div>
                <span className="text-xl font-bold tracking-tight">সিস্টেম অ্যাডমিনিস্ট্রেটর</span>
              </div>

              {/* Decorative line */}
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 w-12 bg-white/30 rounded-full"></div>
                <div className="h-1 flex-1 bg-white/20 rounded-full"></div>
              </div>
            </div>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              initial={false}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
