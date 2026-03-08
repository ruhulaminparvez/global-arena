"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Info } from "lucide-react";
import { Button } from "@/components/button";
import { FadeIn, SlideIn } from "@/components/animations";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent-950 relative overflow-hidden">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <FadeIn>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl shadow-lg mb-4"
            >
              <Wallet className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              পাসওয়ার্ড পুনরুদ্ধার
            </h1>
            <p className="text-slate-400 text-sm">
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
            className="bg-accent-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-8 border border-white/10"
          >
            <div className="space-y-6">
              {/* Info Icon */}
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-900/30 border border-primary-500/20 rounded-full">
                  <Info className="w-8 h-8 text-primary-400" />
                </div>
              </div>

              {/* Information Message */}
              <div className="text-center space-y-4">
                <p className="text-slate-300 leading-relaxed text-base">
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
                    className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-500/25 border-none"
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

