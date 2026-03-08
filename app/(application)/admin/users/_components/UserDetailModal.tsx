"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, Shield, Edit2, IdCard, BadgeCheck, FileText, Wallet, UserCircle, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { getUserProfile, updateUserProfile, adminUpdateUser } from "@/api/admin/users.manage.api";
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

  // New States for Admin User Edits
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

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
          setFirstName(data.user.first_name ?? "");
          setLastName(data.user.last_name ?? "");
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
      // 1. Update Profile Fields (Role, Mobile)
      await updateUserProfile(profile.id, { role, mobile });

      // 2. Update User Fields (Name, Password)
      await adminUpdateUser(user.id, {
        first_name: firstName,
        last_name: lastName,
        ...(password.trim() ? { password } : {})
      });

      setEditing(false);
      setPassword(""); // Clear password field after success
      onUpdated();

      // Optionally refresh local data
      const refreshedProfile = await getUserProfile(user.id);
      setProfile(refreshedProfile);
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
        className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-accent-950 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-xl"
      >
        <div className="shrink-0 bg-gradient-to-r from-primary-900/50 to-indigo-900/50 px-6 py-4 flex items-center justify-between border-b border-white/10">
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

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {loading && (
            <p className="text-slate-400 text-center py-8">লোড হচ্ছে...</p>
          )}
          {error && (
            <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}
          {!loading && profile && (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg tracking-tight">{profile.user.username}</p>
                    <p className="text-sm text-primary-400">{getDisplayName(profile.user)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 rounded-2xl p-4 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">ID:</span>
                    <span className="font-medium text-white truncate">{String(profile.profile_id ?? "—")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Email:</span>
                    <span className="font-medium text-white truncate" title={profile.user.email}>{profile.user.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Phone:</span>
                    <span className="font-medium text-white truncate">{profile.mobile || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Role:</span>
                    <span className="font-medium text-white truncate">{String(profile.role ?? "—")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">NID:</span>
                    <span className="font-medium text-white truncate">{String(profile.nid ?? "—")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Ref ID:</span>
                    <span className="font-medium text-white truncate">{String(profile.reference ?? "—")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Nominee:</span>
                    <span className="font-medium text-white truncate">{String(profile.nominee_name ?? "—")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Nominee NID:</span>
                    <span className="font-medium text-white truncate">{String(profile.nominee_nid ?? "—")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Reg. Fee:</span>
                    <span className={`font-medium truncate ${profile.registration_fee_paid ? 'text-emerald-400' : 'text-rose-400'}`}>{profile.registration_fee_paid ? "Paid" : "Unpaid"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary-500/50 shrink-0" />
                    <span className="text-slate-400 text-sm min-w-[90px]">Fee Amount:</span>
                    <span className="font-medium text-white truncate">৳{String(profile.registration_fee_amount ?? "0")}</span>
                  </div>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4 border-t border-white/10 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="bg-black/30 border-white/10 text-white"
                    />
                    <Input
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="bg-black/30 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">ভূমিকা</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-accent-900">
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
                    className="bg-black/30 border-white/10 text-white"
                  />
                  <Input
                    label="New Password (Leave blank to keep current)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password..."
                    className="bg-black/30 border-white/10 text-white"
                  />
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing(false)}
                      className="flex-1 border-white/10 hover:bg-white/5 text-slate-300"
                    >
                      বাতিল
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 border-none shadow-lg shadow-primary-500/25">
                      সংরক্ষণ করুন
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    icon={Edit2}
                    onClick={() => setEditing(true)}
                    className="w-full mb-6 border-white/10 hover:bg-white/5 text-slate-300"
                  >
                    সম্পাদনা
                  </Button>

                  {/* Referred Users Section */}
                  <div className="border-t border-white/10 pt-6 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-primary-500/20 rounded-xl border border-primary-500/30">
                        <Users className="w-5 h-5 text-primary-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white tracking-tight">
                        Referred Users ({profile.referred_users?.length || 0})
                      </h4>
                    </div>

                    {profile.referred_users && profile.referred_users.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                        {profile.referred_users.map((refUser) => (
                          <div key={refUser.id} className="p-3 bg-black/20 border border-white/5 shadow-inner rounded-xl flex flex-col gap-1 transition-all hover:bg-black/30">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-white truncate" title={`${refUser.first_name} ${refUser.last_name}`.trim()}>
                                {`${refUser.first_name} ${refUser.last_name}`.trim() || refUser.username}
                              </span>
                              <span className="text-xs font-medium text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/20">
                                ID: {refUser.profile_id}
                              </span>
                            </div>
                            <span className="text-sm text-slate-400">@{refUser.username}</span>
                            <span className="text-xs text-slate-500 mt-1">
                              Joined: {new Date(refUser.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-6 bg-black/20 rounded-xl border border-white/5 border-dashed">
                        This user hasn't referred anyone yet.
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
