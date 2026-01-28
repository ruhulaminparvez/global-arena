"use client";

import ProtectedRoute from "@/components/common/ProtectedRoute";

/**
 * Layout for all application routes (dashboard, admin, etc.)
 * All routes under this layout require authentication
 */
export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
