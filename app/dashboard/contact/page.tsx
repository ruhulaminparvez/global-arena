"use client";

import BottomNavigation from "../_components/BottomNavigation";
import { Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[15.5rem] sm:pb-[10.5rem] overflow-x-hidden">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">যোগাযোগের তথ্য</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 text-base sm:text-lg">যোগাযোগের তথ্য এখানে প্রদর্শিত হবে</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

