"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, PiggyBank, Info } from "lucide-react";
import { Button } from "@/components/button";
import { FadeIn, SlideIn } from "@/components/animations";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <FadeIn>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-4"
            >
              <PiggyBank className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              পাসওয়ার্ড পুনরুদ্ধার
            </h1>
            <p className="text-gray-600 text-sm">
              আপনার অ্যাকাউন্ট পুনরুদ্ধারে সহায়তা করুন
            </p>
          </div>
        </FadeIn>

        {/* Information Card */}
        <SlideIn direction="up" delay={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="space-y-6">
              {/* Info Icon */}
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
                  <Info className="w-8 h-8 text-primary-600" />
                </div>
              </div>

              {/* Information Message */}
              <div className="text-center space-y-4">
                <p className="text-gray-700 leading-relaxed text-base">
                  আপনি যদি পাসওয়ার্ড ভুলে যান, তাহলে পাসওয়ার্ড পুনরুদ্ধারের জন্য
                  অনুগ্রহ করে আমাদের প্রধান অফিসে সরাসরি যোগাযোগ করুন। বৈধ তথ্য
                  যাচাইয়ের পর অফিস কর্তৃপক্ষ আপনার অ্যাকাউন্ট পুনরুদ্ধারে সহায়তা
                  করবে।
                </p>
              </div>

              {/* Back to Login Button */}
              <div className="pt-4">
                <Link href="/login">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={ArrowLeft}
                    type="button"
                  >
                    লগইন পেজে ফিরে যান
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </SlideIn>
      </div>
    </div>
  );
}

