"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkRegistrationFee,
  submitFeePayment,
} from "@/api/dashboard/dashboard.api";
import type { FeePaymentMethod } from "@/api/dashboard/types/dashboard.api";

const PAYMENT_METHODS: { value: FeePaymentMethod; label: string }[] = [
  { value: "Bkash", label: "বিকাশ (Bkash)" },
  { value: "Nagad", label: "নগদ (Nagad)" },
  { value: "Bank Transfer", label: "ব্যাংক ট্রান্সফার (Bank Transfer)" },
];

interface PaymentFormState {
  amount: string;
  transaction_id: string;
  payment_method: FeePaymentMethod;
}

const INITIAL_FORM: PaymentFormState = {
  amount: "",
  transaction_id: "",
  payment_method: "Bkash",
};

interface RegistrationFeeGuardProps {
  children: React.ReactNode;
}

export default function RegistrationFeeGuard({
  children,
}: RegistrationFeeGuardProps) {
  const { isAuthenticated, isLoading: authLoading, profile } = useAuth();

  const [feeChecked, setFeeChecked] = useState(false);
  const [feePaid, setFeePaid] = useState(true); // optimistic: assume paid until checked
  const [feeAmount, setFeeAmount] = useState("0.00");
  const [checkLoading, setCheckLoading] = useState(false);

  const [showPayModal, setShowPayModal] = useState(false);
  const [form, setForm] = useState<PaymentFormState>(INITIAL_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const checkFee = useCallback(async () => {
    setCheckLoading(true);
    try {
      const res = await checkRegistrationFee();
      setFeePaid(res.registration_fee_paid);
      setFeeAmount(res.registration_fee_amount);
    } catch {
      // On error, don't block the user — assume paid
      setFeePaid(true);
    } finally {
      setCheckLoading(false);
      setFeeChecked(true);
    }
  }, []);

  useEffect(() => {
    // Reset fee check state on logout so it re-checks on next login
    if (!isAuthenticated) {
      if (feeChecked) {
        setFeeChecked(false);
        setFeePaid(true);
      }
      return;
    }

    // Wait until auth loading is complete and profile is available
    if (authLoading || !profile) return;

    // Already checked for this session
    if (feeChecked) return;

    // Only check registration fee for USER role
    if (profile.role !== "USER") {
      setFeePaid(true);
      setFeeChecked(true);
      return;
    }

    checkFee();
  }, [isAuthenticated, authLoading, profile, feeChecked, checkFee]);

  const handleOpenModal = () => {
    setForm(INITIAL_FORM);
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowPayModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      setSubmitError("সঠিক পরিমাণ লিখুন।");
      return;
    }
    if (!form.transaction_id.trim()) {
      setSubmitError("ট্রানজেকশন আইডি লিখুন।");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    try {
      await submitFeePayment({
        amount: amountNum,
        transaction_id: form.transaction_id.trim(),
        payment_method: form.payment_method,
      });
      setSubmitSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ||
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        "পেমেন্ট জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setSubmitError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  // While auth or fee check is in progress, show a neutral loader
  if (authLoading || (isAuthenticated && !feeChecked) || checkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // If fee not paid, render the full-screen lock
  if (isAuthenticated && feeChecked && !feePaid) {
    return (
      <>
        <LockScreen
          feeAmount={feeAmount}
          onPayClick={handleOpenModal}
        />

        {/* Payment Modal */}
        <AnimatePresence>
          {showPayModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
              onClick={() => !submitLoading && setShowPayModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        রেজিস্ট্রেশন ফি পরিশোধ
                      </h3>
                      <p className="text-primary-100 text-xs">
                        পেমেন্ট তথ্য পূরণ করুন
                      </p>
                    </div>
                  </div>
                  {!submitSuccess && (
                    <button
                      type="button"
                      onClick={() => !submitLoading && setShowPayModal(false)}
                      disabled={submitLoading}
                      className="text-white/70 hover:text-white transition-colors p-1"
                      aria-label="বন্ধ করুন"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {submitSuccess ? (
                    <SuccessView onClose={() => setShowPayModal(false)} />
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          পরিমাণ (৳){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="1"
                          step="0.01"
                          required
                          value={form.amount}
                          onChange={(e) =>
                            setForm({ ...form, amount: e.target.value })
                          }
                          placeholder="যেমন: 500.00"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Transaction ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          ট্রানজেকশন আইডি{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.transaction_id}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              transaction_id: e.target.value,
                            })
                          }
                          placeholder="যেমন: txn_123456"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Payment Method */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          পেমেন্ট পদ্ধতি{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.payment_method}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              payment_method: e.target
                                .value as FeePaymentMethod,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                        >
                          {PAYMENT_METHODS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {submitError && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2"
                          >
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {submitError}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowPayModal(false)}
                          disabled={submitLoading}
                          className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          disabled={submitLoading}
                          className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {submitLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              জমা হচ্ছে...
                            </>
                          ) : (
                            "পেমেন্ট জমা দিন"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Fee is paid (or user not authenticated yet) — render normal children
  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// Lock Screen
// ---------------------------------------------------------------------------
function LockScreen({
  feeAmount,
  onPayClick,
}: {
  feeAmount: string;
  onPayClick: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center"
      >
        {/* Lock icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-300/50"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
        >
          অ্যাকাউন্ট লক করা আছে
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6"
        >
          আপনার রেজিস্ট্রেশন ফি এখনো প্রদান করা হয়নি।
          অ্যাকাউন্ট সক্রিয় করতে অনুগ্রহ করে রেজিস্ট্রেশন ফি পরিশোধ করুন।
        </motion.p>

        {/* Fee amount badge */}
        {parseFloat(feeAmount) > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 font-semibold text-lg mb-6"
          >
            <span>ফি পরিমাণ:</span>
            <span>৳ {parseFloat(feeAmount).toLocaleString("bn-BD")}</span>
          </motion.div>
        )}

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-6" />

        {/* CTA button */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onPayClick}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold text-base shadow-lg shadow-primary-300/40 transition-all flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          রেজিস্ট্রেশন ফি পরিশোধ করুন
        </motion.button>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-xs text-gray-400"
        >
          পেমেন্ট জমা দেওয়ার পর অ্যাডমিন অনুমোদন করলে অ্যাকাউন্ট সক্রিয় হবে।
        </motion.p>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success view inside modal
// ---------------------------------------------------------------------------
function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4"
    >
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">
        পেমেন্ট জমা সফল হয়েছে!
      </h4>
      <p className="text-gray-500 text-sm mb-6">
        আপনার পেমেন্ট তথ্য গ্রহণ করা হয়েছে। অ্যাডমিন অনুমোদনের পর আপনার
        অ্যাকাউন্ট সক্রিয় হবে।
      </p>
      <button
        type="button"
        onClick={onClose}
        className="px-8 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        ঠিক আছে
      </button>
    </motion.div>
  );
}
