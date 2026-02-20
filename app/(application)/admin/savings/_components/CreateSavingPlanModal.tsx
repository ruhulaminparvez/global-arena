"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, PiggyBank } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { getUsers } from "@/api/admin/users.manage.api";
import {
  createSavingPlanForUser,
} from "@/api/admin/savings.manage.api";
import type { User } from "@/api/admin/types/admin.api";

const schema = z.object({
  user_id: z.coerce
    .number({ error: "ব্যবহারকারী নির্বাচন করুন" })
    .min(1, "ব্যবহারকারী নির্বাচন করুন"),
  monthly_amount: z.coerce
    .number({ error: "মাসিক পরিমাণ আবশ্যক" })
    .min(100, "মাসিক পরিমাণ ন্যূনতম ১০০ হতে হবে"),
  duration_months: z.coerce
    .number({ error: "মেয়াদ আবশ্যক" })
    .min(36, "মেয়াদ ন্যূনতম ৩৬ মাস হতে হবে"),
});

type FormValues = z.infer<typeof schema>;

export interface CreateSavingPlanModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateSavingPlanModal({
  onClose,
  onCreated,
}: CreateSavingPlanModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    mode: "onChange",
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getUsers();
        setUsers(res.results ?? []);
      } catch {
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    }
    loadUsers();
  }, []);

  const onSubmit = async (values: FormValues) => {
    const loadingToast = toast.loading("সঞ্চয় প্ল্যান তৈরি হচ্ছে...");
    try {
      await createSavingPlanForUser({
        user_id: values.user_id,
        monthly_amount: values.monthly_amount,
        duration_months: values.duration_months,
      });
      toast.dismiss(loadingToast);
      toast.success("সঞ্চয় প্ল্যান সফলভাবে তৈরি হয়েছে!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const message =
        err instanceof Error ? err.message : "সঞ্চয় প্ল্যান তৈরি ব্যর্থ হয়েছে";
      toast.error(message);
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
        className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 bg-primary-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-white" />
            <h3 className="text-lg font-bold text-white">নতুন সঞ্চয় প্ল্যান</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* User dropdown */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ব্যবহারকারী *
              </label>
              <select
                {...register("user_id")}
                disabled={usersLoading}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.user_id
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500"
                  }`}
              >
                <option value="">
                  {usersLoading
                    ? "ব্যবহারকারী লোড হচ্ছে..."
                    : "ব্যবহারকারী নির্বাচন করুন"}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name || user.last_name
                      ? `${user.first_name} ${user.last_name}`.trim()
                      : user.username}{" "}
                    ({user.username})
                  </option>
                ))}
              </select>
              {errors.user_id && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.user_id.message}
                </motion.p>
              )}
            </div>

            {/* Monthly amount */}
            <Input
              label="মাসিক পরিমাণ (টাকা) *"
              type="number"
              placeholder="ন্যূনতম ১০০"
              error={errors.monthly_amount?.message}
              {...register("monthly_amount")}
            />

            {/* Duration months */}
            <Input
              label="মেয়াদ (মাস) *"
              type="number"
              placeholder="ন্যূনতম ৩৬"
              error={errors.duration_months?.message}
              {...register("duration_months")}
            />

          </div>

          {/* Footer */}
          <div className="shrink-0 flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              প্ল্যান তৈরি করুন
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
