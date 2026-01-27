"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_USER_DATA } from "@/constants/dashboard";
import type { UserDashboardData } from "@/types/dashboard";

// Counter animation hook
function useCounterAnimation(targetValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(targetValue * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, duration]);

  return count;
}

interface UserDetailProps {}

export default function UserDetail({}: UserDetailProps = {}) {
  const router = useRouter();
  const { user } = useAuth();
  const animatedBalance = useCounterAnimation(MOCK_USER_DATA.totalBalance);

  // Check if user is admin
  // const isAdmin = user && (user.role === "ADMIN" || user.role === "admin");
  const isAdmin = true;

  const handleAdminClick = () => {
    router.push("/admin");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 mb-6 relative"
    >
      {/* Button Container */}
      {isAdmin && (
        <div className="absolute top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAdminClick}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-full shadow-lg flex items-center justify-center hover:from-purple-600 hover:to-purple-800 transition-all z-10"
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
          </motion.button>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* User Photo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {MOCK_USER_DATA.photo ? (
                <img
                  src={MOCK_USER_DATA.photo}
                  alt={MOCK_USER_DATA.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary-600" />
              )}
            </div>
          </div>
        </motion.div>

        {/* User Details */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {MOCK_USER_DATA.name}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4"
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">জাতীয় পরিচয়পত্র: {MOCK_USER_DATA.nid}</span>
          </motion.div>

          {/* Total Balance with Counter Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg"
          >
            <p className="text-sm opacity-90 mb-2">মোট ব্যালেন্স</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {animatedBalance.toLocaleString("bn-BD")}
              </span>
              <span className="text-lg">৳</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

