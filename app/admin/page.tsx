"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import AdminHeader from "./_components/AdminHeader";
import AdminSidebarMenu from "./_components/AdminSidebarMenu";
import { LayoutDashboard, TrendingUp, Users, Wallet } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuClick = (item: MenuItem): void => {
    if (item.id === 9) {
      // Logout
      logout();
      router.push("/login");
    } else if (item.route) {
      // Navigate to the route
      router.push(item.route);
      setIsMenuOpen(false);
    }
  };

  // Mock statistics data
  const stats = [
    {
      label: "মোট ব্যবহারকারী",
      value: "1,234",
      icon: Users,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "মোট সঞ্চয়",
      value: "৳ 12,50,000",
      icon: Wallet,
      color: "from-green-500 to-green-700",
    },
    {
      label: "মোট বিনিয়োগ",
      value: "৳ 8,75,000",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-700",
    },
    {
      label: "সক্রিয় টিকেট",
      value: "45",
      icon: LayoutDashboard,
      color: "from-orange-500 to-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      {/* Sidebar Menu */}
      <AdminSidebarMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onMenuClick={handleMenuClick}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 overflow-x-hidden">
        <AdminHeader
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ড্যাশবোর্ড অ্যান্ড রিপোর্টস</h1>
          <p className="text-gray-600">সিস্টেমের সামগ্রিক পরিসংখ্যান এবং রিপোর্ট</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">রিপোর্টস</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">মাসিক রিপোর্ট</h3>
              <p className="text-gray-600 text-sm">এই মাসের সমস্ত লেনদেন এবং কার্যক্রমের সারসংক্ষেপ</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">ব্যবহারকারী রিপোর্ট</h3>
              <p className="text-gray-600 text-sm">নতুন নিবন্ধিত ব্যবহারকারী এবং সক্রিয় ব্যবহারকারীর পরিসংখ্যান</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">আর্থিক রিপোর্ট</h3>
              <p className="text-gray-600 text-sm">সঞ্চয়, বিনিয়োগ এবং লেনদেনের বিস্তারিত আর্থিক বিশ্লেষণ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
