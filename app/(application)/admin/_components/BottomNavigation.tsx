"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ADMIN_MENU_ITEMS } from "@/constants/admin";
import type { MenuItem } from "@/types/dashboard";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActiveRoute = (item: MenuItem): boolean => {
    if (!item.route) return false;
    return pathname === item.route;
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear auth state and cookies
      logout();

      // Show success toast
      toast.success("সফলভাবে লগআউট করা হয়েছে");

      // Close modal
      setShowLogoutModal(false);

      // Redirect to login page (use replace to prevent going back)
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("লগআউট করতে সমস্যা হয়েছে");
      setIsLoggingOut(false);
    }
  };

  // Get color classes for each menu item based on ID
  const getItemColorClasses = (itemId: number, isActive: boolean) => {
    if (isActive) {
      return "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30";
    }

    const colorMap: Record<number, string> = {
      1: "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700", // LayoutDashboard - Blue
      2: "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700", // Wallet - Green
      3: "bg-purple-100 text-purple-600 hover:bg-purple-200 hover:text-purple-700", // TrendingUp - Purple
      4: "bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700", // ArrowUpCircle - Orange
      5: "bg-pink-100 text-pink-600 hover:bg-pink-200 hover:text-pink-700", // Ticket - Pink
      6: "bg-cyan-100 text-cyan-600 hover:bg-cyan-200 hover:text-cyan-700", // MessageSquare - Cyan
      7: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700", // Users - Indigo
      8: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:text-emerald-700", // ArrowDownCircle - Emerald
    };

    return colorMap[itemId] || "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700";
  };

  return (
    <>
      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex items-stretch gap-2 flex-wrap">
            {ADMIN_MENU_ITEMS.map((item: MenuItem) => {
              const Icon: React.ElementType = item.icon;
              const isActive = isActiveRoute(item);

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl transition-all relative min-w-[80px] ${getItemColorClasses(item.id, isActive)}`}
                >
                  <div className="relative z-10">
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isActive ? "text-white" : "text-current"
                        }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold relative z-10 text-center leading-tight transition-colors ${isActive ? "text-white" : "text-current"
                      }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutModal(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl transition-all bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 min-w-[80px]"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">লগআউট</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">লগআউট</h3>
                {!isLoggingOut && (
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoggingOut}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-gray-600 mb-6">
                আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>লগআউট হচ্ছে...</span>
                    </>
                  ) : (
                    "লগআউট"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
