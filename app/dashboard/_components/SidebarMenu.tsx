"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
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
                {MENU_ITEMS.map((item, index) => {
                  const Icon = item.icon;
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
                          : "bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
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

