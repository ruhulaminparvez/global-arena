"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import {
  MessageSquare,
  MessageCircle,
} from "lucide-react";
import { getMyChatRoom } from "@/api/dashboard/chats.api";
import type { MyChatRoom } from "@/api/dashboard/types/dashboard.api";
import { formatDate } from "@/helpers/format.helpers";
import { ChatRoomMessagesModal } from "./_components/ChatRoomMessagesModal";

function getRoomDisplayName(room: MyChatRoom): string {
  const u = room.user;
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ");
  return name || u.username || "সাপোর্ট";
}

export default function ContactPage() {
  const [chatRoom, setChatRoom] = useState<MyChatRoom | null>(null);
  const [chatRoomLoading, setChatRoomLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<MyChatRoom | null>(null);

  const fetchChatRoom = useCallback(async () => {
    setChatRoomLoading(true);
    try {
      const room = await getMyChatRoom();
      setChatRoom(room);
    } catch {
      setChatRoom(null);
    } finally {
      setChatRoomLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatRoom();
  }, [fetchChatRoom]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">যোগাযোগ</h1>
          </div>
          <p className="text-gray-600">
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
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary-600" />
            আমার চ্যাট
          </h2>
          {chatRoomLoading && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
              চ্যাট রুম লোড হচ্ছে...
            </div>
          )}
          {!chatRoomLoading && !chatRoom && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
              আপনার কোনো চ্যাট রুম নেই। সাপোর্টের সাথে যোগাযোগ করতে নিচের ফর্ম ব্যবহার করুন।
            </div>
          )}
          {!chatRoomLoading && chatRoom && (
            <motion.button
              type="button"
              onClick={() => setSelectedRoom(chatRoom)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left flex items-center gap-4 border border-gray-100"
            >
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <MessageSquare className="w-7 h-7 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-gray-900 truncate">
                    {getRoomDisplayName(chatRoom)}
                  </span>
                  {chatRoom.unread_count > 0 && (
                    <span className="shrink-0 px-2 py-0.5 text-xs font-bold rounded-full bg-primary-600 text-white">
                      {chatRoom.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {chatRoom.last_message ?? "কোন বার্তা নেই"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(chatRoom.updated_at)}
                </p>
              </div>
              <span className="text-primary-600 text-sm font-medium shrink-0">বার্তা দেখুন</span>
            </motion.button>
          )}
        </motion.div>
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

