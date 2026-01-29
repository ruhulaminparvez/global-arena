"use client";

import { TableColumn } from "@/components/Table";
import type { User } from "@/api/admin/types/admin.api";
import { Eye, Pencil } from "lucide-react";

function getDisplayName(user: User): string {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || user.username || "—";
}

export interface UsersColumnsOptions {
  onViewDetail?: (user: User) => void;
  onEdit?: (user: User) => void;
}

export const getUsersColumns = (
  options?: UsersColumnsOptions
): TableColumn<User>[] => [
  { key: "id", label: "আইডি", className: "font-mono text-gray-600" },
  {
    key: "username",
    label: "ব্যবহারকারীর নাম",
    render: (user) => (
      <span className="font-medium text-gray-900">{user.username}</span>
    ),
  },
  {
    key: "name",
    label: "নাম",
    render: (user) => (
      <span className="text-gray-700">{getDisplayName(user)}</span>
    ),
  },
  {
    key: "email",
    label: "ইমেইল",
    render: (user) => (
      <span className="text-gray-600">{user.email || "—"}</span>
    ),
  },
  ...(options?.onViewDetail || options?.onEdit
    ? [
        {
          key: "actions",
          label: "কার্যক্রম",
          render: (user: User) => (
            <div className="flex gap-2">
              {options?.onViewDetail && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onViewDetail?.(user);
                  }}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="বিস্তারিত"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {options?.onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    options.onEdit?.(user);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="সম্পাদনা"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          ),
        } as TableColumn<User>,
      ]
    : []),
];
