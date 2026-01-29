"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { createSupportUser } from "@/api/admin/users.manage.api";
import type { CreateSupportUserPayload } from "@/api/admin/types/admin.api";

const initialForm: CreateSupportUserPayload = {
  username: "",
  password: "",
  password2: "",
  email: "",
  first_name: "",
  last_name: "",
  nid: "",
  mobile: "",
  reference_username: "admin",
};

export interface CreateSupportUserModalProps {
  onClose: () => void;
  onCreated: () => void;
  referenceUsername?: string;
}

export function CreateSupportUserModal({
  onClose,
  onCreated,
  referenceUsername = "admin",
}: CreateSupportUserModalProps) {
  const [form, setForm] = useState<CreateSupportUserPayload>({
    ...initialForm,
    reference_username: referenceUsername,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateSupportUserPayload, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: keyof CreateSupportUserPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof CreateSupportUserPayload, string>> = {};
    if (!form.username.trim()) next.username = "ব্যবহারকারীর নাম আবশ্যক";
    if (!form.password) next.password = "পাসওয়ার্ড আবশ্যক";
    if (form.password.length < 8) next.password = "পাসওয়ার্ড অন্তত ৮ অক্ষর হতে হবে";
    if (form.password !== form.password2) next.password2 = "পাসওয়ার্ড মিলছে না";
    if (!form.email.trim()) next.email = "ইমেইল আবশ্যক";
    if (!form.first_name.trim()) next.first_name = "নামের প্রথম অংশ আবশ্যক";
    if (!form.last_name.trim()) next.last_name = "নামের শেষ অংশ আবশ্যক";
    if (!form.nid.trim()) next.nid = "এনআইডি আবশ্যক";
    if (!form.mobile.trim()) next.mobile = "মোবাইল নম্বর আবশ্যক";
    if (!form.reference_username.trim()) next.reference_username = "রেফারেন্স ইউজারনেম আবশ্যক";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      await createSupportUser(form);
      onCreated();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "ব্যবহারকারী তৈরি ব্যর্থ";
      setErrors({ username: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
      >
        <div className="shrink-0 bg-primary-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">নতুন সাপোর্ট ব্যবহারকারী</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <Input
              label="ব্যবহারকারীর নাম *"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              error={errors.username}
              placeholder="support1"
            />
            <Input
              label="ইমেইল *"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              error={errors.email}
              placeholder="support1@example.com"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="প্রথম নাম *"
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                error={errors.first_name}
                placeholder="Support"
              />
              <Input
                label="শেষ নাম *"
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                error={errors.last_name}
                placeholder="Staff"
              />
            </div>
            <Input
              label="পাসওয়ার্ড *"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              error={errors.password}
              placeholder="অন্তত ৮ অক্ষর"
            />
            <Input
              label="পাসওয়ার্ড নিশ্চিতকরণ *"
              type="password"
              value={form.password2}
              onChange={(e) => update("password2", e.target.value)}
              error={errors.password2}
              placeholder="পাসওয়ার্ড আবার লিখুন"
            />
            <Input
              label="এনআইডি *"
              value={form.nid}
              onChange={(e) => update("nid", e.target.value)}
              error={errors.nid}
              placeholder="9876543210"
            />
            <Input
              label="মোবাইল *"
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              error={errors.mobile}
              placeholder="+8801812345678"
            />
            <Input
              label="রেফারেন্স ইউজারনেম *"
              value={form.reference_username}
              onChange={(e) => update("reference_username", e.target.value)}
              error={errors.reference_username}
              placeholder="admin"
            />
          </div>
          <div className="shrink-0 flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              তৈরি করুন
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
