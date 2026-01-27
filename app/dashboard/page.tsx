"use client";

import UserDetail from "./_components/UserDetail";
import MonthlySavingsGraph from "./_components/MonthlySavingsGraph";
import BottomNavigation from "./_components/BottomNavigation";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[15.5rem] sm:pb-[10.5rem] overflow-x-hidden">
        <UserDetail />
        <div className="mb-6">
          <MonthlySavingsGraph />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
