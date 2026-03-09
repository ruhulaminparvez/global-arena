"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import BottomNavigation from "../_components/BottomNavigation";
import { MessageSquare, Search, MessageCircle, CheckCheck, Plus } from "lucide-react";
import { Button } from "@/components/button";
import { RoomMessagesModal } from "./_components/RoomMessagesModal";
import { getChatRooms, markRoomAsRead, getOrCreateRoomForUser } from "@/api/admin/chats.manage.api";
import { getUsers } from "@/api/admin/users.manage.api";
import type { ChatRoom } from "@/api/admin/types/admin.api";
import { formatDate } from "@/helpers/format.helpers";

function getLastMessageText(room: ChatRoom): string {
  if (!room.last_message) return "";
  if (typeof room.last_message === "string") return room.last_message;
  return (room.last_message as any).content ?? (room.last_message as any).message ?? "";
}

function filterRooms(list: ChatRoom[], search: string): ChatRoom[] {
  if (!search.trim()) return list;
  const q = search.trim().toLowerCase();
  return list.filter(
    (r) =>
      String(r.id).includes(q) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      getLastMessageText(r).toLowerCase().includes(q)
  );
}

export default function CommunicationManagementPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  // New Chat Dialog State
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getChatRooms();
      setRooms(res.results ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "চ্যাট রুম লোড করতে সমস্যা হয়েছে";
      toast.error(message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filteredRooms = useMemo(
    () => filterRooms(rooms, searchQuery),
    [rooms, searchQuery]
  );

  const handleMarkAsRead = useCallback(
    async (room: ChatRoom) => {
      try {
        await markRoomAsRead(room.id);
        await fetchRooms();
      } catch {
        toast.error("পঠিত চিহ্নিত করতে ব্যর্থ");
      }
    },
    [fetchRooms]
  );

  const fetchUsersList = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await getUsers({ search: userSearchQuery });
      setUsers(res.results ?? []);
    } catch {
      toast.error("ব্যবহারকারী লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearchQuery]);

  useEffect(() => {
    if (isNewChatModalOpen) {
      fetchUsersList();
    }
  }, [isNewChatModalOpen, fetchUsersList]);

  const handleStartNewChat = async (userId: number) => {
    try {
      const room = await getOrCreateRoomForUser(userId);
      setIsNewChatModalOpen(false);
      setSelectedRoom(room);
      await fetchRooms();
    } catch {
      toast.error("চ্যাট শুরু করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-accent-950 overflow-x-hidden relative text-white font-sans">
      {/* Premium Background Graphics */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/40 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-cyan-900/20 mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary-400" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  যোগাযোগ ম্যানেজমেন্ট
                </h1>
                <p className="text-accent-300 mt-1">
                  চ্যাট রুম ও বার্তা পরিচালনা করুন
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsNewChatModalOpen(true)}
              icon={Plus}
              className="bg-primary-600 hover:bg-primary-500 text-white"
            >
              নতুন চ্যাট শুরু করুন
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="রুম আইডি, নাম বা বার্তা দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Chat Room Cards */}
        <div className="mb-6">
          {loading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-12 text-center text-white/60">
              লোড হচ্ছে...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-12 text-center text-white/60">
              কোন চ্যাট রুম নেই
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:bg-white/10 transition-all flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className="flex-1 p-5 text-left w-full transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary-900/50 border border-primary-500/30 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white truncate">
                            {room.name ?? `রুম #${room.id}`}
                          </span>
                          {(room.unread_count ?? 0) > 0 && (
                            <span className="shrink-0 px-2 py-0.5 text-xs font-bold rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30">
                              {room.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-accent-400 mt-0.5">
                          {formatDate(room.updated_at ?? room.created_at ?? "")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {getLastMessageText(room) || "—"}
                    </p>
                  </button>
                  <div className="p-4 pt-0 flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 min-w-[120px] bg-primary-600 hover:bg-primary-500 text-white"
                      icon={MessageSquare}
                    >
                      বার্তা দেখুন
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(room);
                      }}
                      icon={CheckCheck}
                      className="flex-1 min-w-[100px] border-white/20 text-white hover:bg-white/10"
                    >
                      পঠিত
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />

      <AnimatePresence>
        {selectedRoom && (
          <RoomMessagesModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            onMarkedRead={() => {
              fetchRooms();
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isNewChatModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsNewChatModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[85vh] overflow-hidden bg-accent-950 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-xl text-white"
            >
              <div className="shrink-0 bg-gradient-to-r from-primary-900/50 to-indigo-900/50 px-6 py-4 flex items-center justify-between border-b border-white/10">
                <h3 className="text-lg font-bold">নতুন চ্যাট শুরু করুন</h3>
              </div>
              <div className="p-4 border-b border-white/10 shrink-0">
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="ব্যবহারকারীর নাম বা আইডি খুঁজুন..."
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                {loadingUsers ? (
                  <p className="text-center text-white/50 py-4">লোড হচ্ছে...</p>
                ) : users.length === 0 ? (
                  <p className="text-center text-white/50 py-4">কোন ব্যবহারকারী পাওয়া যায়নি</p>
                ) : (
                  <ul className="space-y-2">
                    {users.map((user) => (
                      <li key={user.id}>
                        <button
                          type="button"
                          onClick={() => handleStartNewChat(user.id)}
                          className="w-fulltext-left flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 w-full"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary-900/50 border border-primary-500/30 flex items-center justify-center shrink-0">
                            {user.first_name?.[0] || 'U'}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-white/50">ID: {user.id} • {user.username}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-4 border-t border-white/10 shrink-0 flex justify-end">
                <Button variant="outline" onClick={() => setIsNewChatModalOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                  বাতিল করুন
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
