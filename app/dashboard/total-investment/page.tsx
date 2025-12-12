"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/types/dashboard";
import UserDetail from "../_components/UserDetail";
import SidebarMenu from "../_components/SidebarMenu";
import { TrendingUp } from "lucide-react";

export default function TotalInvestmentPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuClick = (item: MenuItem): void => {
    if (item.id === 8) {
      router.push("/login");
    } else if (item.route) {
      router.push(item.route);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <SidebarMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onMenuClick={handleMenuClick}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
        <UserDetail
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">আপনার মোট বিনিয়োগ</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">বিনিয়োগের তথ্য এখানে প্রদর্শিত হবে</p>
          </div>
        </div>
      </div>
    </div>
  );
}

