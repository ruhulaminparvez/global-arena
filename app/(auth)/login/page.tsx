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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <AuthHeader
          title="রিটার্ন ভ্যাটেড"
          subtitle="আবার স্বাগতম! স্মার্ট সেভ করুন, ভালো থাকুন।"
          className="mb-8"
        />

        {/* Login Form */}
        <SlideIn direction="up" delay={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="ইউজারনেম"
                type="text"
                icon={User}
                placeholder="আপনার ইউজারনেম দিন"
                {...register("username")}
                error={errors.username?.message}
              />

              <Input
                label="পাসওয়ার্ড"
                type="password"
                icon={Lock}
                placeholder="আপনার পাসওয়ার্ড দিন"
                {...register("password")}
                error={errors.password?.message}
              />

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={authLoading}
                icon={ArrowRight}
                disabled={authLoading}
              >
                সাইন ইন করুন
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    অ্যাকাউন্ট নেই?
                  </span>
                </div>
              </div>

              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-4"
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
