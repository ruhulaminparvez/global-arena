"use client";

import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <FadeIn>
      <div className={cn("text-center mb-6", className)}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-4"
        >
          <PiggyBank className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
    </FadeIn>
  );
}
