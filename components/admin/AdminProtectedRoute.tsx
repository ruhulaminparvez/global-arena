"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component for admin pages
 * Checks if user is authenticated and has ADMIN role.
 * Redirects USER role to dashboard and unauthenticated users to login.
 */
export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Check if user has ADMIN role
      if (profile && profile.role !== "ADMIN") {
        // Redirect USER role to dashboard
        router.push("/dashboard");
        return;
      }
    }
  }, [isAuthenticated, profile, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or not admin
  if (!isAuthenticated || !profile || profile.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
