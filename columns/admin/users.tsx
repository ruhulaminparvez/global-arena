"use client";

import { TableColumn } from "@/components/Table";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joinDate: string;
};

export const getUsersColumns = (): TableColumn<User>[] => [
  { key: "id", label: "আইডি" },
  { key: "name", label: "নাম", className: "font-medium" },
  { key: "email", label: "ইমেইল", className: "text-gray-600" },
  { key: "phone", label: "ফোন", className: "text-gray-600" },
  { key: "role", label: "ভূমিকা", className: "text-gray-600" },
  {
    key: "status",
    label: "স্ট্যাটাস",
    render: (user) => (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${user.status === "সক্রিয়"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800"
          }`}
      >
        {user.status}
      </span>
    ),
  },
  { key: "joinDate", label: "যোগদান তারিখ", className: "text-gray-600" },
  {
    key: "actions",
    label: "কার্যক্রম",
    render: () => (
      <div className="flex gap-2">
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          দেখুন
        </button>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          সম্পাদনা
        </button>
      </div>
    ),
  },
];
