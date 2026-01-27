"use client";

import UserDetail from "../_components/UserDetail";
import BottomNavigation from "../_components/BottomNavigation";
import { Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
        <UserDetail />
        
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">আমাদের সাথে যোগাযোগের তথ্য</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">যোগাযোগের তথ্য এখানে প্রদর্শিত হবে</p>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}

