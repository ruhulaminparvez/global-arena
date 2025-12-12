"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { locales, type Locale } from "@/i18n";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const isDark = pathname.includes("/signin") || pathname.includes("/signup");

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isDark
            ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            : "bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">
          {locale === "bn" ? "বাংলা" : "English"}
        </span>
        <ChevronDown className="w-4 h-4" />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]"
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`block w-full px-4 py-2 text-left hover:bg-green-50 transition-colors ${
                  locale === loc ? "bg-green-100 font-semibold" : ""
                }`}
              >
                {loc === "bn" ? "বাংলা" : "English"}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

