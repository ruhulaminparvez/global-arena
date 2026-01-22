"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Menu, Shield, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AdminHeader({ isMenuOpen, setIsMenuOpen }: AdminHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

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
      <div className="absolute top-4 left-4 md:left-auto md:right-4 flex gap-2">
        {/* Dashboard Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDashboardClick}
          className="w-12 h-12 md:w-auto md:px-4 md:h-auto md:py-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full md:rounded-lg shadow-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-800 transition-all z-10"
        >
          <LayoutDashboard className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="hidden md:inline font-medium text-sm">ড্যাশবোর্ড</span>
        </motion.button>

        {/* Hamburger Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 md:w-auto md:px-4 md:h-auto md:py-2 bg-primary-600 text-white rounded-full md:rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-primary-700 transition-all z-10"
        >
          <Menu className="w-6 h-6 md:w-4 md:h-4 flex-shrink-0" />
          <span className="hidden md:inline font-medium text-sm">Show Menu</span>
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Admin Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Shield className="w-12 h-12 text-primary-600" />
            </div>
          </div>
        </motion.div>

        {/* Admin Details */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            অ্যাডমিন প্যানেল
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4"
          >
            <span className="text-sm">
              {user?.user?.username || user?.user?.email || "অ্যাডমিন"}
            </span>
          </motion.div>

          {/* Admin Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-4 text-white shadow-lg inline-block"
          >
            <p className="text-sm opacity-90 mb-1">অ্যাডমিন এক্সেস</p>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-lg font-semibold">সিস্টেম অ্যাডমিনিস্ট্রেটর</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
