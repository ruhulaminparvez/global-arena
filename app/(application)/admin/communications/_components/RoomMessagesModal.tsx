"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCheck } from "lucide-react";
import { Button } from "@/components/button";
import { getRoomMessages, markRoomAsRead } from "@/api/admin/chats.manage.api";
import type { ChatRoom, ChatMessage } from "@/api/admin/types/admin.api";
import { formatDate } from "@/helpers/format.helpers";

export interface RoomMessagesModalProps {
  room: ChatRoom | null;
  onClose: () => void;
  onMarkedRead?: () => void;
}

export function RoomMessagesModal({
  room,
  onClose,
  onMarkedRead,
}: RoomMessagesModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    if (!room) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRoomMessages(room.id)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "বার্তা লোড করতে ব্যর্থ");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [room?.id]);

  const handleMarkAsRead = async () => {
    if (!room) return;
    setMarkingRead(true);
    try {
      await markRoomAsRead(room.id);
      onMarkedRead?.();
    } catch {
      setError("পঠিত চিহ্নিত করতে ব্যর্থ");
    } finally {
      setMarkingRead(false);
    }
  };

  if (!room) return null;

  const roomLabel = room.name ?? `রুম #${room.id}`;

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
        className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
      >
        <div className="shrink-0 bg-primary-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{roomLabel}</h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={CheckCheck}
              onClick={handleMarkAsRead}
              isLoading={markingRead}
              className="text-white hover:bg-white/20"
            >
              পঠিত
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
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
                      {msg.sender_username ?? msg.sender ?? "অজানা"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.created_at ? formatDate(msg.created_at) : "—"}
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm">{msg.content ?? "—"}</p>
                  {msg.is_read != null && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      {msg.is_read ? "পঠিত" : "অপঠিত"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
