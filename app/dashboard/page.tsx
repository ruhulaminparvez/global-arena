"use client";

import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 p-4">
      <div className="max-w-4xl mx-auto pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-4"
          >
            <PiggyBank className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Global Arena
          </h1>
          <p className="text-gray-600">
            Your savings dashboard is coming soon!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <p className="text-gray-600 mb-6">
            This is a placeholder dashboard page. The main features will be
            implemented here.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

