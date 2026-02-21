"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getRoomMessages } from "@/api/dashboard/chats.api";
import type { MyChatRoom, ChatMessage } from "@/api/dashboard/types/dashboard.api";
import { formatDate } from "@/helpers/format.helpers";
import toast from "react-hot-toast";

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

function getDisplayName(user: MyChatRoom["user"]): string {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || user.username || "—";
}

export interface ChatRoomMessagesModalProps {
  room: MyChatRoom | null;
  onClose: () => void;
}

export function ChatRoomMessagesModal({ room, onClose }: ChatRoomMessagesModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!room) return;
    let cancelled = false;
    setLoading(true);
    getRoomMessages(room.id)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          toast.error(getApiError(err, "বার্তা লোড করতে ব্যর্থ হয়েছে।"));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [room?.id]);

  if (!room) return null;

  const displayName = getDisplayName(room.user);

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
        className="w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
      >
        <div className="shrink-0 bg-primary-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{displayName}</h3>
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
            <p className="text-gray-500 text-center py-8">বার্তা লোড হচ্ছে...</p>
          )}
          {!loading && messages.length === 0 && (
            <p className="text-gray-500 text-center py-8">কোন বার্তা নেই</p>
          )}
          {!loading && messages.length > 0 && (
            <ul className="space-y-4">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`p-4 rounded-lg border ${
                    msg.is_read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-primary-50/50 border-primary-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {msg.sender_username ?? msg.sender ?? "—"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.created_at ? formatDate(msg.created_at) : "—"}
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm">{msg.content ?? "—"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
