"use client";

import { TableColumn } from "@/components/Table";
import { formatDate } from "@/helpers/format.helpers";
import type { ChatRoom } from "@/api/admin/types/admin.api";
import { MessageSquare, CheckCheck } from "lucide-react";

export interface CommunicationsColumnsOptions {
  onViewMessages?: (room: ChatRoom) => void;
  onMarkAsRead?: (room: ChatRoom) => void;
}

export const getCommunicationsColumns = (
  options?: CommunicationsColumnsOptions
): TableColumn<ChatRoom>[] => [
  { key: "id", label: "আইডি", className: "font-mono text-gray-600" },
  {
    key: "name",
    label: "রুম",
    render: (room) => (
      <span className="font-medium text-gray-900">
        {room.name ?? `রুম #${room.id}`}
      </span>
    ),
  },
  {
    key: "last_message",
    label: "সর্বশেষ বার্তা",
    render: (room) => (
      <span className="text-gray-600 max-w-[200px] truncate block" title={room.last_message}>
        {room.last_message ?? "—"}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "তারিখ",
    render: (room) =>
      room.created_at ? formatDate(room.created_at) : "—",
  },
  {
    key: "unread_count",
    label: "অপঠিত",
    render: (room) => {
      const count = Number(room.unread_count ?? 0);
      return count > 0 ? (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
          {count}
        </span>
      ) : (
        <span className="text-gray-400">০</span>
      );
    },
  },
  ...(options?.onViewMessages || options?.onMarkAsRead
    ? [
        {
          key: "actions",
          label: "কার্যক্রম",
          render: (room: ChatRoom) => (
            <div className="flex gap-2">
              {options?.onViewMessages && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onViewMessages?.(room);
                  }}
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                  title="বার্তা দেখুন"
                >
                  <MessageSquare className="w-4 h-4" />
                  বার্তা দেখুন
                </button>
              )}
              {options?.onMarkAsRead && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onMarkAsRead?.(room);
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                  title="পঠিত হিসাবে চিহ্নিত করুন"
                >
                  <CheckCheck className="w-4 h-4" />
                  পঠিত
                </button>
              )}
            </div>
          ),
        } as TableColumn<ChatRoom>,
      ]
    : []),
];
