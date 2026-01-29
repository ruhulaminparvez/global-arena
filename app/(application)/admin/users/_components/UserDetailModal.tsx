"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, Shield, Edit2 } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { getUserProfile, updateUserProfile } from "@/api/admin/users.manage.api";
import type { User as ApiUser, Profile, UserRole } from "@/api/admin/types/admin.api";

function getDisplayName(user: ApiUser): string {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || user.username || "—";
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "USER", label: "User" },
  { value: "SUPPORT", label: "Support" },
  { value: "ADMIN", label: "Admin" },
];

export interface UserDetailModalProps {
  user: ApiUser;
  onClose: () => void;
  onUpdated: () => void;
}

export function UserDetailModal({ user, onClose, onUpdated }: UserDetailModalProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState<UserRole>("USER");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getUserProfile(user.id)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          setRole((data.role as UserRole) ?? "USER");
          setMobile(data.mobile ?? "");
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "প্রোফাইল লোড করতে ব্যর্থ");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updateUserProfile(profile.id, { role, mobile });
      setEditing(false);
      onUpdated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "আপডেট ব্যর্থ");
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
          <h3 className="text-lg font-bold text-white">ব্যবহারকারী বিস্তারিত</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <p className="text-gray-500 text-center py-8">লোড হচ্ছে...</p>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {!loading && profile && (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{profile.user.username}</p>
                    <p className="text-sm text-gray-600">{getDisplayName(profile.user)}</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{profile.user.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{profile.mobile || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span>{String(profile.role ?? "—")}</span>
                  </div>
                  {profile.nid != null && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400">NID:</span>
                      <span>{profile.nid}</span>
                    </div>
                  )}
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ভূমিকা</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="মোবাইল"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+8801812345678"
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing(false)}
                      className="flex-1"
                    >
                      বাতিল
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} className="flex-1">
                      সংরক্ষণ করুন
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  icon={Edit2}
                  onClick={() => setEditing(true)}
                  className="w-full"
                >
                  সম্পাদনা
                </Button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
