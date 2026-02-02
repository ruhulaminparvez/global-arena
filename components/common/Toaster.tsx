"use client";

import { Toaster as HotToaster } from "react-hot-toast";

/**
 * Global Toaster component with custom styling to match website design
 * Uses Bengali font and website color scheme
 */
export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerClassName="!z-[9999]"
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#1f2937",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e5e7eb",
          fontFamily: "var(--font-anek-bangla), sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          maxWidth: "400px",
          minWidth: "300px",
        },
        // Success toast styling
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
          style: {
            background: "#f0fdf4",
            color: "#15803d",
            border: "1px solid #86efac",
          },
          className: "toast-success",
        },
        // Error toast styling
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
          className: "toast-error",
        },
        // Loading toast styling
        loading: {
          duration: Infinity,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
          },
          className: "toast-loading",
        },
      }}
    />
  );
}
