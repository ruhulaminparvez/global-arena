"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import {
  MessageSquare,
  MessageCircle,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMyChatRoom, getChatRooms } from "@/api/dashboard/chats.api";
import type { MyChatRoom } from "@/api/dashboard/types/dashboard.api";
import { formatDate } from "@/helpers/format.helpers";
import { ChatRoomMessagesModal } from "./_components/ChatRoomMessagesModal";
import toast from "react-hot-toast";

function getLastMessageText(room: MyChatRoom): string {
  if (!room.last_message) return "";
  if (typeof room.last_message === "string") return room.last_message;
  return (room.last_message as any).content ?? (room.last_message as any).message ?? "";
}

function getApiError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: unknown } }).response?.data;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.detail === "string") return d.detail;
      const first = Object.values(d)[0];
      if (Array.isArray(first) && typeof first[0] === "string") return first[0];
      if (typeof first === "string") return first;
    }
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

function getRoomDisplayName(room: MyChatRoom): string {
  const u = room.user;
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ");
  return name || u.username || "সাপোর্ট";
}

const ALLOWED_ROLES = ["SUPPORT"];

export default function ContactPage() {
  const { profile } = useAuth();
  const canViewAllRooms =
    !!profile?.role && ALLOWED_ROLES.includes(profile.role.toUpperCase());

  const [chatRoom, setChatRoom] = useState<MyChatRoom | null>(null);
  const [chatRoomLoading, setChatRoomLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<MyChatRoom | null>(null);

  const [allRooms, setAllRooms] = useState<MyChatRoom[]>([]);
  const [allRoomsLoading, setAllRoomsLoading] = useState(false);

  const fetchChatRoom = useCallback(async () => {
    setChatRoomLoading(true);
    try {
      const room = await getMyChatRoom();
      setChatRoom(room);
    } catch (err) {
      toast.error(getApiError(err, "চ্যাট রুম লোড করতে সমস্যা হয়েছে।"));
      setChatRoom(null);
    } finally {
      setChatRoomLoading(false);
    }
  }, []);

  const fetchAllChatRooms = useCallback(async () => {
    if (!canViewAllRooms) return;
    setAllRoomsLoading(true);
    try {
      const res = await getChatRooms();
      setAllRooms(res.results ?? []);
    } catch (err) {
      toast.error(getApiError(err, "চ্যাট রুম তালিকা লোড করতে সমস্যা হয়েছে।"));
      setAllRooms([]);
    } finally {
      setAllRoomsLoading(false);
    }
  }, [canViewAllRooms]);

  useEffect(() => {
    fetchChatRoom();
  }, [fetchChatRoom]);

  useEffect(() => {
    fetchAllChatRooms();
  }, [fetchAllChatRooms]);

  return (
    <div className="min-h-screen bg-accent-950 overflow-x-hidden relative">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-primary-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">যোগাযোগ</h1>
          </div>
          <p className="text-slate-400">
            আপনার চ্যাট রুম দেখুন এবং বার্তা পাঠান।
          </p>
        </motion.div>

        {/* My Chat Room - Conversation channel card(s) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary-400" />
            আমার চ্যাট
          </h2>
          {chatRoomLoading && (
            <div className="bg-accent-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-8 text-center text-slate-400">
              চ্যাট রুম লোড হচ্ছে...
            </div>
          )}
          {!chatRoomLoading && !chatRoom && (
            <div className="bg-accent-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-8 text-center text-slate-400">
              আপনার কোনো চ্যাট রুম নেই। সাপোর্টের সাথে যোগাযোগ করতে নিচের ফর্ম ব্যবহার করুন।
            </div>
          )}
          {!chatRoomLoading && chatRoom && (
            <motion.button
              type="button"
              onClick={() => setSelectedRoom(chatRoom)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white/5 rounded-2xl shadow-lg p-6 hover:bg-white/10 transition-colors text-left flex items-center gap-4 border border-white/10 backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 border border-primary-500/30">
                <MessageSquare className="w-7 h-7 text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-white truncate">
                    {getRoomDisplayName(chatRoom)}
                  </span>
                  {chatRoom.unread_count > 0 && (
                    <span className="shrink-0 px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 shadow-lg shadow-primary-500/25 text-white">
                      {chatRoom.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 truncate">
                  {getLastMessageText(chatRoom) || "কোন বার্তা নেই"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDate(chatRoom.updated_at)}
                </p>
              </div>
              <span className="text-primary-400 text-sm font-medium shrink-0">বার্তা দেখুন</span>
            </motion.button>
          )}
        </motion.div>

        {/* All Chat Rooms - SUPPORT / ADMIN only */}
        {canViewAllRooms && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-400" />
              সমস্ত চ্যাট রুম
            </h2>
            {allRoomsLoading && (
              <div className="bg-accent-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-8 text-center text-slate-400">
                চ্যাট রুম লোড হচ্ছে...
              </div>
            )}
            {!allRoomsLoading && allRooms.length === 0 && (
              <div className="bg-accent-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-8 text-center text-slate-400">
                কোন চ্যাট রুম নেই
              </div>
            )}
            {!allRoomsLoading && allRooms.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allRooms.map((room, index) => (
                  <motion.button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white/5 rounded-2xl shadow-lg p-5 hover:bg-white/10 transition-colors text-left flex items-center gap-4 border border-white/10 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 border border-primary-500/30">
                      <MessageSquare className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-white truncate">
                          {getRoomDisplayName(room)}
                        </span>
                        {room.unread_count > 0 && (
                          <span className="shrink-0 px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 shadow-lg shadow-primary-500/25 text-white">
                            {room.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 truncate">
                        {getLastMessageText(room) || "কোন বার্তা নেই"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(room.updated_at)}
                      </p>
                    </div>
                    <span className="text-primary-400 text-sm font-medium shrink-0">
                      বার্তা দেখুন
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <BottomNavigation />

      <AnimatePresence>
        {selectedRoom && (
          <ChatRoomMessagesModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

