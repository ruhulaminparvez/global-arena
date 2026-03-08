"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { SlideIn } from "@/components/animations";
import { AuthHeader } from "@/components/common/AuthHeader";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/schema/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const loadingToast = toast.loading("লগইন করা হচ্ছে...");

    try {
      await login(data);
      toast.dismiss(loadingToast);
      toast.success("সফলভাবে লগইন করা হয়েছে!");
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = error.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent-950 relative overflow-hidden">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="mb-8">
          <AuthHeader
            title="রিটার্ন ভ্যাটেড"
            subtitle="আবার স্বাগতম! স্মার্ট সেভ করুন, ভালো থাকুন।"
          />
        </div>

        {/* Login Form */}
        <SlideIn direction="up" delay={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-accent-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-8 border border-white/10"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1">
                <Input
                  label={<span className="text-primary-300 font-medium tracking-wide uppercase text-xs">ইউজারনেম</span>}
                  type="text"
                  icon={User}
                  placeholder="আপনার ইউজারনেম দিন"
                  {...register("username")}
                  error={errors.username?.message}
                  className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:ring-primary-500/50 focus:border-primary-500 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-1">
                <Input
                  label={<span className="text-primary-300 font-medium tracking-wide uppercase text-xs">পাসওয়ার্ড</span>}
                  type="password"
                  icon={Lock}
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  {...register("password")}
                  error={errors.password?.message}
                  className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:ring-primary-500/50 focus:border-primary-500 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded bg-white/5 checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform pointer-events-none">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    মনে রাখুন
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-500/25 border-none mt-2"
                isLoading={authLoading}
                icon={ArrowRight}
                disabled={authLoading}
              >
                সাইন ইন করুন
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-accent-900 text-slate-400 font-medium tracking-wide rounded-full border border-white/5 py-1">
                    অ্যাকাউন্ট নেই?
                  </span>
                </div>
              </div>

              <Link href="/register" className="block mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all"
                  type="button"
                >
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </Button>
              </Link>
            </div>
          </motion.div>
        </SlideIn>
      </div>
    </div>
  );
}
