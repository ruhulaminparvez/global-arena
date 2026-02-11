"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useEffect } from "react";

const BANNER_DISMISS_KEY = "pwa-install-banner-dismissed";

export function PWAInstallBanner() {
  const { isInstallable, isStandalone, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const stored = sessionStorage.getItem(BANNER_DISMISS_KEY);
    if (stored === "true") setDismissed(true);
  }, [mounted]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(BANNER_DISMISS_KEY, "true");
    }
  };

  const show = mounted && isInstallable && !isStandalone && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-[env(safe-area-inset-bottom)] sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:rounded-2xl sm:shadow-xl"
          role="dialog"
          aria-label="Install app"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100">
              <Download className="h-6 w-6 text-white dark:text-slate-900" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">Return Vetted</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Install for a better experience
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={installApp}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Install
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
