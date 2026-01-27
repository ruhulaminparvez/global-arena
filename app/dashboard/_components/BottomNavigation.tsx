"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MENU_ITEMS } from "@/constants/dashboard";
import type { MenuItem } from "@/types/dashboard";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const visibleMenuItems = MENU_ITEMS.filter((item: MenuItem) => {
    // Exclude logout (id: 8)
    if (item.id === 8) return false;
    // Show all other items
    return true;
  });

  const isActiveRoute = (item: MenuItem): boolean => {
    if (!item.route) return false;
    return pathname === item.route;
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl safe-area-inset-bottom"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="max-w-6xl mx-auto px-3 py-3">
          <div className="grid grid-cols-3 sm:flex sm:items-stretch gap-2">
            {visibleMenuItems.map((item: MenuItem) => {
              const Icon: React.ElementType = item.icon;
              const isActive = isActiveRoute(item);

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl transition-all relative sm:flex-1 ${
                    isActive
                      ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-primary-600"
                  }`}
                >
                  <div className="relative z-10">
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                        isActive ? "text-white" : "text-current"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold relative z-10 text-center leading-tight transition-colors ${
                      isActive ? "text-white" : "text-current"
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
              className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl transition-all bg-gray-50 text-red-500 hover:bg-red-50 hover:text-red-600 sm:flex-1"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">লগআউট</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
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
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                লগআউট
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
