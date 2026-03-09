"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    getWalletTransactions,
    getSavingTransactions
} from "@/api/dashboard/dashboard.api";
import type {
    WalletTransaction,
    SavingTransaction
} from "@/api/dashboard/types/dashboard.api";
import { formatDate } from "@/helpers/format.helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getTransactionTypeLabel(type: string): string {
    switch (type) {
        case "DEPOSIT": return "জমা";
        case "WITHDRAW": return "উত্তোলন";
        case "DEDUCT": return "কর্তন";
        case "PROFIT": return "লাভ";
        default: return type;
    }
}

function getTransactionTypeColor(type: string): string {
    switch (type) {
        case "DEPOSIT":
        case "PROFIT":
            return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        case "WITHDRAW":
        case "DEDUCT":
            return "text-rose-400 bg-rose-400/10 border-rose-400/20";
        default:
            return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
}

export default function DashboardTransactionTables() {
    const [walletTx, setWalletTx] = useState<WalletTransaction[]>([]);
    const [walletLoading, setWalletLoading] = useState(true);
    const [walletPage, setWalletPage] = useState(1);
    const [walletHasNext, setWalletHasNext] = useState(false);
    const [walletHasPrev, setWalletHasPrev] = useState(false);

    const [savingTx, setSavingTx] = useState<SavingTransaction[]>([]);
    const [savingLoading, setSavingLoading] = useState(true);
    const [savingPage, setSavingPage] = useState(1);
    const [savingHasNext, setSavingHasNext] = useState(false);
    const [savingHasPrev, setSavingHasPrev] = useState(false);

    const fetchWallet = useCallback(async (page: number) => {
        setWalletLoading(true);
        try {
            const res = await getWalletTransactions(page);
            setWalletTx(res.results ?? []);
            setWalletHasNext(!!res.next);
            setWalletHasPrev(!!res.previous);
        } catch {
            setWalletTx([]);
        } finally {
            setWalletLoading(false);
        }
    }, []);

    const fetchSaving = useCallback(async (page: number) => {
        setSavingLoading(true);
        try {
            const res = await getSavingTransactions(page);
            setSavingTx(res.results ?? []);
            setSavingHasNext(!!res.next);
            setSavingHasPrev(!!res.previous);
        } catch {
            setSavingTx([]);
        } finally {
            setSavingLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWallet(walletPage);
    }, [fetchWallet, walletPage]);

    useEffect(() => {
        fetchSaving(savingPage);
    }, [fetchSaving, savingPage]);

    return (
        <div className="space-y-6">
            {/* Wallet Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">সমস্ত লেনদেন</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-black/20 text-slate-300 font-medium border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">আইডি</th>
                                <th className="px-6 py-4">লেনদেনের ধরন</th>
                                <th className="px-6 py-4">পরিমাণ (৳)</th>
                                <th className="px-6 py-4">বিবরণ</th>
                                <th className="px-6 py-4 text-right">তারিখ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {walletLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        লোড হচ্ছে...
                                    </td>
                                </tr>
                            ) : walletTx.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        কোন লেনদেন নেই
                                    </td>
                                </tr>
                            ) : (
                                walletTx.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-300">#{tx.id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${getTransactionTypeColor(tx.type)}`}>
                                                {getTransactionTypeLabel(tx.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-white">
                                            ৳ {parseFloat(tx.amount).toLocaleString("bn-BD")}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 truncate max-w-[250px]">
                                            {tx.description || "—"}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400 text-xs">
                                            {formatDate(tx.created_at)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Wallet Pagination */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/10">
                    <span className="text-sm text-slate-400">পৃষ্ঠা {walletPage}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setWalletPage((p) => Math.max(1, p - 1))}
                            disabled={!walletHasPrev || walletLoading}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => setWalletPage((p) => p + 1)}
                            disabled={!walletHasNext || walletLoading}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Savings Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">মাসিক সঞ্চয় বিবরণী</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-black/20 text-slate-300 font-medium border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">ট্রানজেকশন আইডি</th>
                                <th className="px-6 py-4">সঞ্চয় প্ল্যান আইডি</th>
                                <th className="px-6 py-4">পরিমাণ (৳)</th>
                                <th className="px-6 py-4 text-right">তারিখ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {savingLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                        লোড হচ্ছে...
                                    </td>
                                </tr>
                            ) : savingTx.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                        কোন সঞ্চয় নেই
                                    </td>
                                </tr>
                            ) : (
                                savingTx.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-300">#{tx.id}</td>
                                        <td className="px-6 py-4 text-slate-300">#{tx.plan}</td>
                                        <td className="px-6 py-4 font-semibold text-emerald-400">
                                            + ৳ {parseFloat(tx.amount).toLocaleString("bn-BD")}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400 text-xs">
                                            {formatDate(tx.created_at)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Savings Pagination */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/10">
                    <span className="text-sm text-slate-400">পৃষ্ঠা {savingPage}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSavingPage((p) => Math.max(1, p - 1))}
                            disabled={!savingHasPrev || savingLoading}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => setSavingPage((p) => p + 1)}
                            disabled={!savingHasNext || savingLoading}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
