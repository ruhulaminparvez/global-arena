"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { Users, Search, UserPlus } from "lucide-react";
import Table from "@/components/Table";
import { Button } from "@/components/button";
import { getUsersColumns } from "@/columns/admin/users";
import { UserDetailModal } from "./_components/UserDetailModal";
import { CreateSupportUserModal } from "./_components/CreateSupportUserModal";
import { getUsers } from "@/api/admin/users.manage.api";
import type { User } from "@/api/admin/types/admin.api";

function filterUsers(
  list: User[],
  search: string
): User[] {
  if (!search.trim()) return list;
  const q = search.trim().toLowerCase();
  return list.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.first_name && u.first_name.toLowerCase().includes(q)) ||
      (u.last_name && u.last_name.toLowerCase().includes(q)) ||
      `${(u.first_name || "").toLowerCase()} ${(u.last_name || "").toLowerCase()}`.includes(q) ||
      `${(u.last_name || "").toLowerCase()} ${(u.first_name || "").toLowerCase()}`.includes(q)
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers();
      setUsers(res.results ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে";
      setError(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(
    () => filterUsers(users, searchQuery),
    [users, searchQuery]
  );

  const columns = useMemo(
    () =>
      getUsersColumns({
        onViewDetail: (user) => setSelectedUser(user),
        onEdit: (user) => setSelectedUser(user),
      }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[18rem] sm:pb-[12rem] overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ইউজার ম্যানেজমেন্ট
                </h1>
                <p className="text-gray-600 mt-1">
                  সমস্ত ব্যবহারকারী পরিচালনা করুন
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                icon={UserPlus}
                onClick={() => setCreateModalOpen(true)}
              >
                নতুন সাপোর্ট ব্যবহারকারী
              </Button>
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
              placeholder="নাম, ইমেইল বা ইউজারনেম দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Users Table */}
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
              data={filteredUsers}
              columns={columns}
              emptyMessage="কোন ব্যবহারকারী পাওয়া যায়নি"
              itemsPerPage={10}
            />
          )}
        </div>
      </div>

      <BottomNavigation />

      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdated={() => {
              fetchUsers();
              setSelectedUser(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createModalOpen && (
          <CreateSupportUserModal
            onClose={() => setCreateModalOpen(false)}
            onCreated={() => {
              fetchUsers();
              setCreateModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
