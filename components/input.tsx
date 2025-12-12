"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { forwardRef, useState } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragExit" | "onDragLeave" | "onDragOver" | "onDrop" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      icon: Icon,
      type = "text",
      containerClassName,
      className,
      ...props
    },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            type={inputType}
            className={cn(
              "w-full px-4 py-3 rounded-lg border-2 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              Icon && "pl-10",
              isPassword && "pr-10",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-primary-500",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

