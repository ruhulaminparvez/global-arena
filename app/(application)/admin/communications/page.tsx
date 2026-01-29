"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { MessageSquare, Search, MessageCircle, CheckCheck } from "lucide-react";
import { Button } from "@/components/button";
import { RoomMessagesModal } from "./_components/RoomMessagesModal";
import { getChatRooms, markRoomAsRead } from "@/api/admin/chats.manage.api";
import type { ChatRoom } from "@/api/admin/types/admin.api";
import { formatDate } from "@/helpers/format.helpers";

function filterRooms(list: ChatRoom[], search: string): ChatRoom[] {
  if (!search.trim()) return list;
  const q = search.trim().toLowerCase();
  return list.filter(
    (r) =>
      String(r.id).includes(q) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.last_message && r.last_message.toLowerCase().includes(q))
  );
}

export default function CommunicationManagementPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChatRooms();
      setRooms(res.results ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "চ্যাট রুম লোড করতে সমস্যা হয়েছে";
      setError(message);
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
        setError("পঠিত চিহ্নিত করতে ব্যর্থ");
      }
    },
    [fetchRooms]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  যোগাযোগ ম্যানেজমেন্ট
                </h1>
                <p className="text-gray-600 mt-1">
                  চ্যাট রুম ও বার্তা পরিচালনা করুন
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="রুম আইডি, নাম বা বার্তা দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Chat Room Cards */}
        <div className="mb-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
              লোড হচ্ছে...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
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
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className="flex-1 p-5 text-left w-full hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 truncate">
                            {room.name ?? `রুম #${room.id}`}
                          </span>
                          {(room.unread_count ?? 0) > 0 && (
                            <span className="shrink-0 px-2 py-0.5 text-xs font-bold rounded-full bg-primary-600 text-white">
                              {room.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(room.updated_at ?? room.created_at ?? "")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {room.last_message ?? "—"}
                    </p>
                  </button>
                  <div className="p-4 pt-0 flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 min-w-[120px]"
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
                      className="flex-1 min-w-[100px]"
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
    </div>
  );
}
