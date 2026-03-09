"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { getRoomMessages, sendMessage } from "@/api/dashboard/chats.api";
import type { MyChatRoom, ChatMessage } from "@/api/dashboard/types/dashboard.api";
import { formatDate } from "@/helpers/format.helpers";
import toast from "react-hot-toast";
import { Button } from "@/components/button";

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
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
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
          setError(getApiError(err, "বার্তা লোড করতে ব্যর্থ হয়েছে।"));
          toast.error(getApiError(err, "বার্তা লোড করতে ব্যর্থ হয়েছে।"));
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
          sender_username: "You",
          created_at: new Date().toISOString(),
          is_read: true,
        },
      ]);

      await sendMessage(room.id, msgText);
      await fetchMessages();
    } catch (err: unknown) {
      toast.error(getApiError(err, "বার্তা পাঠাতে ব্যর্থ হয়েছে"));
      setNewMessage(newMessage); // Restore if failed
    }
  };

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
        className="w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl bg-accent-900 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-xl"
      >
        <div className="shrink-0 bg-gradient-to-r from-primary-900/50 to-indigo-900/50 px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{displayName}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
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
                      {String(msg.sender_username ??
                        (typeof msg.sender === 'object' && msg.sender !== null ? getDisplayName(msg.sender as any) : msg.sender) ??
                        "—")}
                    </span>
                    <span className="text-xs text-slate-400">
                      {msg.created_at ? formatDate(msg.created_at) : "—"}
                    </span>
                  </div>
                  <pre className="text-white text-sm whitespace-pre-wrap font-sans">
                    {typeof msg.content === 'object' && msg.content !== null ? JSON.stringify(msg.content, null, 2) :
                      (typeof msg.content === 'string' ? msg.content :
                        (typeof (msg as any).message === 'object' && (msg as any).message !== null ? JSON.stringify((msg as any).message, null, 2) :
                          (typeof (msg as any).message === 'string' ? (msg as any).message : String(msg.content ?? (msg as any).message ?? ""))))}
                  </pre>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>

        <div className="bg-black/20 p-4 border-t border-white/10 shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="আপনার বার্তা লিখুন..."
              className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              icon={Send}
              className="rounded-xl shadow-lg shadow-primary-500/25 border-none"
            >
              পাঠান
            </Button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
