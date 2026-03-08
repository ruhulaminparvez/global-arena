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
    { key: "id", label: "আইডি", className: "font-mono text-slate-400" },
    {
      key: "username",
      label: "ব্যবহারকারীর নাম",
      render: (user) => (
        <span className="font-medium text-white">{user.username}</span>
      ),
    },
    {
      key: "name",
      label: "নাম",
      render: (user) => (
        <span className="text-slate-300">{getDisplayName(user)}</span>
      ),
    },
    {
      key: "email",
      label: "ইমেইল",
      render: (user) => (
        <span className="text-slate-400">{user.email || "—"}</span>
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
                  className="p-2 text-primary-400 hover:bg-white/10 rounded-xl transition-colors"
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
                  className="p-2 text-emerald-400 hover:bg-white/10 rounded-xl transition-colors"
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
