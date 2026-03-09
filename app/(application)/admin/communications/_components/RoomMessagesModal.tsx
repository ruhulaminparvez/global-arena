"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, CheckCheck, Send } from "lucide-react";
import { Button } from "@/components/button";
import { getRoomMessages, markRoomAsRead, sendMessage } from "@/api/admin/chats.manage.api";
import type { ChatRoom, ChatMessage } from "@/api/admin/types/admin.api";
import { formatDate } from "@/helpers/format.helpers";
import toast from "react-hot-toast";

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
  const [newMessage, setNewMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!room) return;
    try {
      const data = await getRoomMessages(room.id);
      setMessages(data);
    } catch (err: unknown) {
      console.error("Failed to fetch messages", err);
    }
  };

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

    // Polling interval for new messages
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [room?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !room) return;

    try {
      const msgText = newMessage;
      setNewMessage("");

      // Optimistically add message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: msgText,
          sender_username: "Admin (You)",
          created_at: new Date().toISOString(),
          is_read: true,
        },
      ]);

      await sendMessage(room.id, msgText);
      await fetchMessages();
    } catch (err: unknown) {
      toast.error("বার্তা পাঠাতে ব্যর্থ হয়েছে");
      setNewMessage(newMessage); // Restore if failed
    }
  };

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
        className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-accent-950 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-xl"
      >
        <div className="shrink-0 bg-gradient-to-r from-primary-900/50 to-indigo-900/50 px-6 py-4 flex items-center justify-between border-b border-white/10">
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

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {error && (
            <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}
          {loading && (
            <p className="text-slate-400 text-center py-8">বার্তা লোড হচ্ছে...</p>
          )}
          {!loading && messages.length === 0 && (
            <p className="text-slate-400 text-center py-8">কোন বার্তা নেই</p>
          )}
          {!loading && messages.length > 0 && (
            <ul className="space-y-4">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`p-4 rounded-xl border backdrop-blur-sm transition-all ${msg.is_read
                    ? "bg-white/5 border-white/10"
                    : "bg-primary-500/20 border-primary-500/30"
                    }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      {msg.sender_username ?? msg.sender ?? "অজানা"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {msg.created_at ? formatDate(msg.created_at) : "—"}
                    </span>
                  </div>
                  <p className="text-white text-sm whitespace-pre-wrap">
                    {typeof msg.content === 'object' && msg.content !== null ? JSON.stringify(msg.content, null, 2) :
                      (typeof msg.content === 'string' ? msg.content :
                        (typeof (msg as any).message === 'object' && (msg as any).message !== null ? JSON.stringify((msg as any).message, null, 2) :
                          (typeof (msg as any).message === 'string' ? (msg as any).message : JSON.stringify(msg))))}
                  </p>
                  {msg.is_read != null && (
                    <span className="text-xs text-slate-500 mt-2 block">
                      {msg.is_read ? "✓ পঠিত" : "অপঠিত"}
                    </span>
                  )}
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>

        <div className="shrink-0 bg-black/40 px-6 py-4 flex items-center justify-between border-t border-white/10">
          <form onSubmit={handleSendMessage} className="flex gap-3 w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="আপনার বার্তা লিখুন..."
              className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              icon={Send}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium shadow-lg transition-all"
            >
              পাঠান
            </Button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
