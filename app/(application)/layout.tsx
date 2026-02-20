"use client";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import RegistrationFeeGuard from "@/components/common/RegistrationFeeGuard";

/**
 * Layout for all application routes (dashboard, admin, etc.)
 * All routes under this layout require authentication and a paid registration fee.
 */
export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <RegistrationFeeGuard>{children}</RegistrationFeeGuard>
    </ProtectedRoute>
  );
}
