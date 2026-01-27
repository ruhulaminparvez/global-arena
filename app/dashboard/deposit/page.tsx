"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { ArrowDownCircle } from "lucide-react";

export default function DepositPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <ArrowDownCircle className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">জমা</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 text-base sm:text-lg">জমার ফর্ম এখানে প্রদর্শিত হবে</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

