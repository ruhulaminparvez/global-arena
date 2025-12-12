"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-green-100 rounded-lg">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Profile
                </h1>
                <p className="text-gray-600">Savings Platform for Farmers & Working People</p>
              </div>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-500">Profile content coming soon...</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
