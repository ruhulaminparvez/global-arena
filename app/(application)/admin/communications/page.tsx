"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { MessageSquare, Search } from "lucide-react";
import Table from "@/components/Table";
import { getCommunicationsColumns } from "@/columns/admin/communications";
import { RoomMessagesModal } from "./_components/RoomMessagesModal";
import { getChatRooms, markRoomAsRead } from "@/api/admin/chats.manage.api";
import type { ChatRoom } from "@/api/admin/types/admin.api";

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

  const columns = useMemo(
    () =>
      getCommunicationsColumns({
        onViewMessages: (room) => setSelectedRoom(room),
        onMarkAsRead: handleMarkAsRead,
      }),
    [handleMarkAsRead]
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

        {/* Chat Rooms Table */}
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
          ) : (
            <Table
              data={filteredRooms}
              columns={columns}
              emptyMessage="কোন চ্যাট রুম নেই"
              itemsPerPage={10}
            />
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
