"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  ArrowRight,
  CreditCard,
  Image,
  Phone,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { SlideIn } from "@/components/animations";
import { AuthHeader } from "@/components/common/AuthHeader";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/schema/auth.schema";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      nid: "",
      nomineeName: "",
      nomineeNid: "",
      nomineePhoto: undefined,
      referenceName: "",
      phoneOrEmail: "",
      termsAccepted: false,
    },
  });

  const photo = watch("photo");
  const nomineePhoto = watch("nomineePhoto");

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "photo" | "nomineePhoto"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(fieldName, file, { shouldValidate: true });
      await trigger(fieldName);
    }
  };

  const removeFile = (fieldName: "photo" | "nomineePhoto") => {
    setValue(fieldName, undefined as any, { shouldValidate: true });
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setError(null);
    setSuccess(false);

    try {
      await registerUser(data);
      setSuccess(true);
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Logo and Header */}
        <AuthHeader
          title="রিটার্ন ভ্যাটেড"
          subtitle="আজই আপনার সঞ্চয়ের যাত্রা শুরু করুন"
        />

        {/* Registration Form */}
        <SlideIn direction="up" delay={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    ব্যক্তিগত তথ্য
                  </h2>
                </div>

                <Input
                  label="নাম"
                  type="text"
                  icon={User}
                  placeholder="আপনার পূর্ণ নাম দিন"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Input
                  label="এনআইডি"
                  type="text"
                  icon={CreditCard}
                  placeholder="আপনার জাতীয় পরিচয়পত্র নম্বর দিন (১০ সংখ্যা)"
                  {...register("nid")}
                  error={errors.nid?.message}
                />

                {/* Photo Upload */}
                <div className="w-full md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ছবি <span className="text-red-500">*</span>
                  </label>
                  {photo ? (
                    <div className="relative">
                      <div
                        className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-colors ${
                          errors.photo
                            ? "border-red-500 bg-red-50"
                            : "border-primary-300 bg-primary-50"
                        }`}
                      >
                        <Image className="h-8 w-8 text-primary-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {photo.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(photo.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("photo")}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        errors.photo
                          ? "border-red-500 bg-red-50 hover:bg-red-100"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload
                          className={`w-8 h-8 mb-2 ${
                            errors.photo ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">ক্লিক করুন</span> অথবা ফাইল টেনে আনুন
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (সর্বোচ্চ ৫ এমবি)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "photo")}
                      />
                    </label>
                  )}
                  {errors.photo && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.photo.message as string}
                    </motion.p>
                  )}
                </div>

                <Input
                  label="ফোন নম্বর বা ইমেইল"
                  type="text"
                  icon={Phone}
                  placeholder="ফোন নম্বর বা ইমেইল ঠিকানা দিন"
                  {...register("phoneOrEmail")}
                  error={errors.phoneOrEmail?.message}
                  className="col-span-1"
                />
              </div>

              {/* Nominee Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    নমিনির তথ্য
                  </h2>
                </div>

                <Input
                  label="নমিনির নাম"
                  type="text"
                  icon={User}
                  placeholder="নমিনির পূর্ণ নাম দিন"
                  {...register("nomineeName")}
                  error={errors.nomineeName?.message}
                />

                <Input
                  label="নমিনির এনআইডি"
                  type="text"
                  icon={CreditCard}
                  placeholder="নমিনির জাতীয় পরিচয়পত্র নম্বর দিন (১০ সংখ্যা)"
                  {...register("nomineeNid")}
                  error={errors.nomineeNid?.message}
                />

                {/* Nominee Photo Upload */}
                <div className="w-full md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    নমিনির ছবি <span className="text-red-500">*</span>
                  </label>
                  {nomineePhoto ? (
                    <div className="relative">
                      <div
                        className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-colors ${
                          errors.nomineePhoto
                            ? "border-red-500 bg-red-50"
                            : "border-primary-300 bg-primary-50"
                        }`}
                      >
                        <Image className="h-8 w-8 text-primary-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {nomineePhoto.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(nomineePhoto.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("nomineePhoto")}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        errors.nomineePhoto
                          ? "border-red-500 bg-red-50 hover:bg-red-100"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload
                          className={`w-8 h-8 mb-2 ${
                            errors.nomineePhoto ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">ক্লিক করুন</span> অথবা ফাইল টেনে আনুন
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (সর্বোচ্চ ৫ এমবি)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "nomineePhoto")}
                      />
                    </label>
                  )}
                  {errors.nomineePhoto && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.nomineePhoto.message as string}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Reference Information Section */}
              <div className="grid grid-cols-1 gap-6 pt-6 border-t">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    রেফারেন্সের তথ্য
                  </h2>
                </div>

                <Input
                  label="রেফারেন্সের নাম"
                  type="text"
                  icon={User}
                  placeholder="রেফারেন্সের পূর্ণ নাম দিন"
                  {...register("referenceName")}
                  error={errors.referenceName?.message}
                  className="md:col-span-2"
                />
              </div>

              <div className="flex items-start pt-6 border-t">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  {...register("termsAccepted")}
                />
                <label className="ml-2 text-sm text-gray-600">
                  আমি{" "}
                  <Link
                    href="/terms"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    শর্তাবলী
                  </Link>{" "}
                  এবং{" "}
                  <Link
                    href="/privacy"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    গোপনীয়তা নীতি
                  </Link>{" "}
                  এর সাথে সম্মত
                </label>
              </div>
              {errors.termsAccepted && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.termsAccepted.message}
                </motion.p>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Registration successful! Redirecting to dashboard...</span>
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={authLoading}
                icon={ArrowRight}
                disabled={authLoading || success}
              >
                অ্যাকাউন্ট তৈরি করুন
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    ইতিমধ্যে অ্যাকাউন্ট আছে?
                  </span>
                </div>
              </div>

              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-4"
                  type="button"
                >
                  সাইন ইন করুন
                </Button>
              </Link>
            </div>
          </motion.div>
        </SlideIn>
      </div>
    </div>
  );
}
