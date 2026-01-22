"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { SlideIn } from "@/components/animations";
import { AuthHeader } from "@/components/common/AuthHeader";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/schema/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In real app, handle authentication here
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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
                label="ইমেইল বা ফোন নম্বর"
                type="text"
                icon={Phone}
                placeholder="ইমেইল বা ফোন নম্বর দিন"
                {...register("emailOrPhone")}
                error={errors.emailOrPhone?.message}
              />

              <Input
                label="পাসওয়ার্ড"
                type="password"
                icon={Lock}
                placeholder="আপনার পাসওয়ার্ড দিন"
                {...register("password")}
                error={errors.password?.message}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    মনে রাখুন
                  </span>
                </label>
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
                isLoading={isLoading}
                icon={ArrowRight}
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
