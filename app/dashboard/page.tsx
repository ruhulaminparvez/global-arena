"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/types/dashboard";
import UserDetail from "./_components/UserDetail";
import MonthlySavingsGraph from "./_components/MonthlySavingsGraph";
import SidebarMenu from "./_components/SidebarMenu";

export default function DashboardPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuClick = (item: MenuItem): void => {
    if (item.id === 8) {
      // Logout
      router.push("/login");
    } else {
      // Handle other menu items
      console.log("Clicked:", item.label);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Sidebar Menu */}
      <SidebarMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onMenuClick={handleMenuClick}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        <UserDetail
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <MonthlySavingsGraph />
      </div>
    </div>
  );
}
