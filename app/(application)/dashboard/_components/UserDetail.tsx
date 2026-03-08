"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Shield,
  Wallet,
  TrendingUp,
  Info,
  Lock,
  Timer,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_USER_PHOTO } from "@/constants/dashboard";
import { getDisplayName } from "@/helpers/format.helpers";
import { getMediaUrl } from "@/helpers/media.helpers";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { getMyWallet } from "@/api/dashboard/dashboard.api";
import type { MyWallet } from "@/api/dashboard/types/dashboard.api";
import { getMyPurchases } from "@/api/dashboard/tickets.api";
import type { TicketPurchase } from "@/api/dashboard/types/dashboard.api";
import { ProfileDetailModal } from "./ProfileDetailModal";

interface UserDetailProps { }

export default function UserDetail({ }: UserDetailProps = {}) {
  const router = useRouter();
  const { profile } = useAuth();
  const [wallet, setWallet] = useState<MyWallet | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);

  const [activeTicket, setActiveTicket] = useState<TicketPurchase | null>(null);
  const [ticketLoading, setTicketLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [liveProfit, setLiveProfit] = useState<number>(0);

  const balanceNum = wallet
    ? parseFloat(wallet.balance) || 0
    : 0;
  const lockedNum = wallet
    ? parseFloat(wallet.locked_amount) || 0
    : 0;
  const availableNum = wallet?.available_balance ?? 0;

  const animatedBalance = useCounterAnimation(balanceNum);
  const animatedLiveProfit = useCounterAnimation(liveProfit);

  const [isHovered, setIsHovered] = useState(false);
  const [showProfileDetail, setShowProfileDetail] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchWallet = async (isBackground = false) => {
      if (!isBackground) setWalletLoading(true);
      try {
        const data = await getMyWallet();
        if (!cancelled) setWallet(data);
      } catch (error) {
        if (!cancelled && !isBackground) setWallet(null);
      } finally {
        if (!cancelled && !isBackground) setWalletLoading(false);
      }
    };

    fetchWallet();

    const walletInterval = setInterval(() => {
      fetchWallet(true);
    }, 60000); // 1 minute refresh

    setTicketLoading(true);
    getMyPurchases()
      .then((data) => {
        if (!cancelled) {
          const active = data.results.find((p) => !p.profit_added);
          setActiveTicket(active || null);
        }
      })
      .catch(() => {
        if (!cancelled) setActiveTicket(null);
      })
      .finally(() => {
        if (!cancelled) setTicketLoading(false);
      });

    return () => {
      cancelled = true;
      clearInterval(walletInterval);
    };
  }, []);

  useEffect(() => {
    if (!activeTicket) {
      setTimeRemaining("00:00:00");
      setLiveProfit(0);
      return;
    }

    const durationDays = activeTicket.ticket.duration_days;
    const parsedProfit = parseFloat(activeTicket.profit_amount || activeTicket.ticket.profit_amount.toString() || "0");
    const durationMs = durationDays * 24 * 60 * 60 * 1000;
    const createdAt = new Date(activeTicket.created_at).getTime();
    const endTime = createdAt + durationMs;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining("00:00:00");
        setLiveProfit(parsedProfit);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        let timeStr = "";
        if (days > 0) timeStr += `${days}d `;
        timeStr += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setTimeRemaining(timeStr);

        const elapsedMs = now - createdAt;
        if (durationMs > 0) {
          const currentProfit = (elapsedMs / durationMs) * parsedProfit;
          setLiveProfit(currentProfit > parsedProfit ? parsedProfit : currentProfit);
        } else {
          setLiveProfit(parsedProfit);
        }
      }
    }, 1000);

    // Run once immediately to avoid 1-second delay
    const initialNow = Date.now();
    const initialDiff = endTime - initialNow;
    if (initialDiff > 0 && durationMs > 0) {
      const currentProfit = ((initialNow - createdAt) / durationMs) * parsedProfit;
      setLiveProfit(currentProfit > parsedProfit ? parsedProfit : currentProfit);
    }

    return () => clearInterval(interval);
  }, [activeTicket]);

  const displayName = getDisplayName(profile?.user);

  // Check if user is admin
  const isAdmin = profile && profile.role?.toUpperCase() === "ADMIN";

  const handleAdminClick = () => {
    router.push("/admin");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 mb-10 relative overflow-hidden"
      >
        {/* Decorative top header glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-50"></div>

        {/* Top-right action buttons */}
        <div className="relative z-30 mb-4 flex justify-end items-center gap-2 md:mb-0 md:absolute md:top-6 md:right-6">

          {isAdmin && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAdminClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-12 h-12 bg-white/10 border border-white/20 text-white rounded-2xl backdrop-blur-md shadow-xl flex items-center justify-center hover:bg-white/20 hover:border-white/40 transition-all z-10 group"
              >
                <div className="absolute inset-0 bg-primary-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                <Shield className="w-5 h-5 flex-shrink-0 relative z-10" />
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-full mr-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none"
                  >
                    <div className="relative">
                      {/* Glow effect */}
                      <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary-500/50 blur-xl -z-10 rounded-lg"
                      ></motion.div>

                      {/* Tooltip content */}
                      <div className="relative bg-accent-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl whitespace-nowrap border border-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary-400" />
                          <span>অ্যাডমিন প্যানেল</span>
                        </div>

                        {/* Arrow */}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-1">
                          <div className="w-3 h-3 bg-accent-900 rotate-45 border-r border-t border-white/20"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-20">
          {/* User Photo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="relative group shrink-0"
          >
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400 via-cyan-500 to-indigo-600 opacity-60 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500"></div>

            {/* Main image container */}
            <div className="relative w-32 h-32 rounded-3xl bg-accent-900 border border-white/10 p-[2px] shadow-2xl backdrop-blur-xl">
              <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                {profile?.photo ? (
                  <motion.img
                    src={getMediaUrl(profile.photo, DEFAULT_USER_PHOTO)}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-[22px]"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 rounded-2xl border border-white/10"
                  >
                    <User className="w-12 h-12 text-primary-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left pt-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center md:justify-start gap-3 mb-2"
            >
              <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">{displayName}</h2>
              <motion.button
                type="button"
                aria-label="View profile details"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowProfileDetail(true)}
                className="p-1.5 rounded-full bg-white/10 text-primary-300 border border-white/10 hover:bg-white/20 transition-colors shadow-sm"
              >
                <Info className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-accent-300 mb-6 mt-1"
            >
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/5">
                <CreditCard className="w-4 h-4 text-primary-300" />
                <span className="text-sm font-medium">জাতীয় পরিচয়পত্র: {profile?.nid || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/5">
                <User className="w-4 h-4 text-cyan-300" />
                <span className="text-sm font-medium">ইউজারনেম: {profile?.user.username || "N/A"}</span>
              </div>
            </motion.div>

            <div className="flex flex-col xl:flex-row gap-6 w-full mt-4">
              {/* Left Side: Ticket Timer (Red Theme) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 100 }}
                className="flex-[1] relative group overflow-hidden rounded-2xl bg-gradient-to-br from-red-950/80 to-black/80 border border-red-500/30 p-6 text-white shadow-2xl backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
                <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-red-500/20 rounded-full blur-[50px]"></div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs tracking-widest uppercase font-semibold text-red-300">সক্রিয় টিকেট সময়</p>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="p-1.5 bg-red-500/20 rounded-full backdrop-blur-sm"
                      >
                        <Timer className="w-4 h-4 text-red-300" />
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 backdrop-blur-sm shadow-inner hidden sm:block text-red-400"
                      >
                        <Clock className="w-6 h-6" />
                      </motion.div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]">
                          {ticketLoading ? "—:—:—" : timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 border-t border-red-500/30 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-200">লাইভ লাভ</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white tracking-widest font-mono">
                          {ticketLoading ? "—" : animatedLiveProfit.toLocaleString("bn-BD", { minimumFractionDigits: 5, maximumFractionDigits: 5 })}
                        </span>
                        <span className="text-sm font-semibold text-red-300">৳</span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"
                  initial={false}
                ></motion.div>
              </motion.div>

              {/* Right Side: Total Balance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="flex-[1.5] relative group overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900/50 to-indigo-900/50 border border-primary-500/30 p-6 text-white shadow-2xl backdrop-blur-md"
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>

                {/* Glowing orb accent inside banner */}
                <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary-500/30 rounded-full blur-[50px]"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div>
                    {/* Header with icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-xs tracking-widest uppercase font-semibold text-primary-300">মোট ব্যালেন্স</p>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="p-2 bg-white/10 rounded-full backdrop-blur-sm"
                      >
                        <TrendingUp className="w-4 h-4 text-primary-300" />
                      </motion.div>
                    </div>

                    {/* Balance amount */}
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="p-3 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm shadow-inner hidden sm:block"
                      >
                        <Wallet className="w-6 h-6 text-primary-300" />
                      </motion.div>
                      <div className="flex items-baseline gap-3">
                        <motion.span
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="text-4xl sm:text-5xl font-bold tracking-tight text-white/90"
                        >
                          {walletLoading
                            ? "—"
                            : animatedBalance.toLocaleString("bn-BD")}
                        </motion.span>
                        <span className="text-xl font-semibold opacity-80 text-primary-200">৳</span>
                      </div>
                    </div>
                  </div>

                  {/* Available & locked breakdown */}
                  {!walletLoading && (
                    <div className="mt-2 flex flex-wrap gap-4 text-sm border-t border-white/10 pt-4">
                      <div className="flex items-center gap-1.5 opacity-90 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium text-slate-200">প্রাপ্য: <span className="text-white">{availableNum.toLocaleString("bn-BD")} ৳</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-90 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                        <Lock className="w-4 h-4 text-rose-400" />
                        <span className="font-medium text-slate-200">লকড: <span className="text-white">{lockedNum.toLocaleString("bn-BD")} ৳</span></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"
                  initial={false}
                ></motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {showProfileDetail && profile && (
          <ProfileDetailModal
            profile={profile}
            onClose={() => setShowProfileDetail(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
