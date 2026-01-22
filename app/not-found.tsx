"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number with Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            পেজটি পাওয়া যায়নি
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            দুঃখিত, আপনি যে পেজটি খুঁজছেন তা পাওয়া যায়নি
          </p>
          <p className="text-base text-gray-500">
            পেজটি সরানো, মুছে ফেলা বা কখনও বিদ্যমান ছিল না
          </p>
        </motion.div>

        {/* Illustration/Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <Search className="w-16 h-16 md:w-20 md:h-20 text-primary-600" />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-semibold text-lg"
          >
            <Home className="w-5 h-5" />
            <span>হোম পেজে যান</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all flex items-center justify-center gap-2 font-semibold text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>পিছনে যান</span>
          </motion.button>
        </motion.div>

        {/* Additional Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-500">
            যদি আপনি মনে করেন এটি একটি ত্রুটি, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন
          </p>
        </motion.div>
      </div>
    </div>
  );
}
