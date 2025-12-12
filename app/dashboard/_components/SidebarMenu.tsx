"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { MENU_ITEMS } from "@/constants/dashboard";
import type { MenuItem } from "@/types/dashboard";

interface SidebarMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  onMenuClick: (item: MenuItem) => void;
}

export default function SidebarMenu({
  isMenuOpen,
  setIsMenuOpen,
  onMenuClick,
}: SidebarMenuProps) {
  const pathname = usePathname();

  const isActiveRoute = (item: MenuItem): boolean => {
    if (!item.route) return false;
    return pathname === item.route;
  };

  // Check if user is on a sub-route (not the main dashboard)
  const isOnSubRoute = pathname !== "/dashboard" && pathname.startsWith("/dashboard/");

  // Filter and sort menu items - show dashboard option only on sub-routes
  const visibleMenuItems = MENU_ITEMS.filter((item) => {
    // Always show logout
    if (item.id === 8) return true;
    // Show dashboard option only on sub-routes
    if (item.id === 0) return isOnSubRoute;
    // Show all other items
    return true;
  }).sort((a, b) => {
    // Keep dashboard (id: 0) at the top when visible, logout (id: 8) at the bottom
    if (a.id === 0) return -1;
    if (b.id === 0) return 1;
    if (a.id === 8) return 1;
    if (b.id === 8) return -1;
    return a.id - b.id;
  });

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pr-12">মেনু</h2>
              <div className="space-y-2">
                {visibleMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item);
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onMenuClick(item)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                        item.id === 8
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : isActive
                          ? "bg-primary-100 text-primary-700 border-2 border-primary-500 font-semibold"
                          : "bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-700" : ""}`} />
                      <span className="text-left font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

