"use client";

import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  Wallet,
  X,
  Mail,
  Phone,
  IdCard,
  BadgeCheck,
  UserCircle,
  Calendar,
  FileText,
} from "lucide-react";
import { DEFAULT_USER_PHOTO } from "@/constants/dashboard";
import { formatDate, getDisplayName } from "@/helpers/format.helpers";
import { getMediaUrl } from "@/helpers/media.helpers";
import type { Profile } from "@/types/auth";
import { DetailRow } from "./DetailRow";

export interface ProfileDetailModalProps {
  profile: Profile;
  onClose: () => void;
}

export function ProfileDetailModal({ profile, onClose }: ProfileDetailModalProps) {
  const displayName = getDisplayName(profile.user);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[68vh] md:max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-white" />
            <h3 className="text-lg font-bold text-white">প্রোফাইল বিস্তারিত</h3>
          </div>
          <motion.button
            type="button"
            aria-label="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Photo & name */}
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary-100 bg-primary-50 flex items-center justify-center">
              {profile.photo ? (
                <img
                  src={getMediaUrl(profile.photo, DEFAULT_USER_PHOTO)}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary-600" />
              )}
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-500">@{profile.user?.username}</p>
            </div>
          </div>

          {/* User & account info */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <h4 className="text-sm font-semibold text-primary-700 mb-3 flex items-center gap-2">
              <IdCard className="w-4 h-4" />
              অ্যাকাউন্ট তথ্য
            </h4>
            <div className="space-y-0">
              <DetailRow
                icon={BadgeCheck}
                label="প্রোফাইল আইডি"
                value={profile.profile_id}
              />
              <DetailRow
                icon={User}
                label="ভূমিকা"
                value={profile.role}
              />
              <DetailRow
                icon={CreditCard}
                label="জাতীয় পরিচয়পত্র (এনআইডি)"
                value={profile.nid}
              />
              <DetailRow
                icon={Mail}
                label="ইমেইল"
                value={profile.email || profile.user?.email || "—"}
              />
              <DetailRow
                icon={Phone}
                label="মোবাইল"
                value={profile.mobile}
              />
              <DetailRow
                icon={FileText}
                label="রেফারেন্স আইডি"
                value={String(profile.reference)}
              />
            </div>
          </div>

          {/* Registration fee */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <h4 className="text-sm font-semibold text-primary-700 mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              নিবন্ধন ফি
            </h4>
            <div className="space-y-0">
              <DetailRow
                icon={BadgeCheck}
                label="পরিশোধিত"
                value={
                  profile.registration_fee_paid ? "হ্যাঁ" : "না"
                }
              />
              <DetailRow
                icon={CreditCard}
                label="পরিমাণ (৳)"
                value={profile.registration_fee_amount}
              />
            </div>
          </div>

          {/* Nominee */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <h4 className="text-sm font-semibold text-primary-700 mb-3 flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              নমিনি তথ্য
            </h4>
            <div className="space-y-0">
              <DetailRow
                icon={User}
                label="নমিনির নাম"
                value={profile.nominee_name}
              />
              <DetailRow
                icon={CreditCard}
                label="নমিনির এনআইডি"
                value={profile.nominee_nid}
              />
              {profile.nominee_photo && (
                <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
                  <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      নমিনির ফটো
                    </p>
                    <img
                      src={getMediaUrl(profile.nominee_photo, DEFAULT_USER_PHOTO)}
                      alt="Nominee"
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 p-4">
            <h4 className="text-sm font-semibold text-primary-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              তারিখ
            </h4>
            <div className="space-y-0">
              <DetailRow
                icon={Calendar}
                label="তৈরির তারিখ"
                value={formatDate(profile.created_at)}
              />
              <DetailRow
                icon={Calendar}
                label="আপডেটের তারিখ"
                value={formatDate(profile.updated_at)}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
