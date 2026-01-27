"use client";

import UserDetail from "./_components/UserDetail";
import MonthlySavingsGraph from "./_components/MonthlySavingsGraph";
import BottomNavigation from "./_components/BottomNavigation";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden pb-20">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
        <UserDetail />
        <MonthlySavingsGraph />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
