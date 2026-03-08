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
      className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 mb-10 relative overflow-hidden"
    >
      {/* Decorative top header glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-50"></div>

      {/* Button Container */}
      <div className="absolute top-6 right-6 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDashboardClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-12 h-12 bg-white/10 border border-white/20 text-white rounded-2xl backdrop-blur-md shadow-xl flex items-center justify-center hover:bg-white/20 hover:border-white/40 transition-all z-10 group"
        >
          <div className="absolute inset-0 bg-primary-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          <LayoutDashboard className="w-5 h-5 flex-shrink-0 relative z-10" />
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none"
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-primary-500/50 blur-xl -z-10 rounded-lg"
                ></motion.div>

                {/* Tooltip content */}
                <div className="relative bg-accent-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl whitespace-nowrap border border-white/20 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-primary-400" />
                    <span>ড্যাশবোর্ডে যান</span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-1">
                    <div className="w-3 h-3 bg-accent-900 rotate-45 border-r border-t border-white/20"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-20">
        {/* Admin Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="relative group shrink-0"
        >
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400 via-cyan-500 to-indigo-600 opacity-60 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500"></div>

          {/* Main badge container */}
          <div className="relative w-32 h-32 rounded-3xl bg-accent-900 border border-white/10 p-[2px] shadow-2xl backdrop-blur-xl">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden border border-white/10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 rounded-2xl border border-white/10"
              >
                <Shield className="w-12 h-12 text-primary-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Admin Details */}
        <div className="flex-1 text-center md:text-left pt-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white tracking-tight drop-shadow-md"
          >
            অ্যাডমিন প্যানেল
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center md:justify-start gap-2 text-accent-300 mt-1 mb-6"
          >
            <p className="text-base font-medium bg-white/10 px-3 py-1 rounded-full border border-white/5">
              {displayName || "অ্যাডমিন"}
            </p>
          </motion.div>

          {/* Admin Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900/50 to-indigo-900/50 border border-primary-500/30 p-6 text-white shadow-2xl w-full backdrop-blur-md"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>

            {/* Glowing orb accent inside banner */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary-500/30 rounded-full blur-[50px]"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest uppercase font-semibold text-primary-300">অ্যাডমিন এক্সেস</p>
              </div>

              {/* Admin Title */}
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm shadow-inner"
                >
                  <Shield className="w-6 h-6 text-primary-300" />
                </motion.div>
                <span className="text-2xl font-bold tracking-tight text-white/90">সিস্টেম অ্যাডমিনিস্ট্রেটর</span>
              </div>
            </div>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"
              initial={false}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
