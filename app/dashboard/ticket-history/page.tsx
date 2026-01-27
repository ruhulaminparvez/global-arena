"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../_components/BottomNavigation";
import { Ticket, Search, Plus, X, MessageSquare } from "lucide-react";
import { MOCK_USER_TICKETS } from "@/constants/dashboard";
import type { UserTicket } from "@/constants/dashboard";
import Table, { TableColumn } from "@/components/Table";

export default function TicketHistoryPage() {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [tickets, setTickets] = useState<UserTicket[]>(MOCK_USER_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    priority: "মধ্যম",
    description: "",
  });

  // Filter tickets based on search and filters
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        searchQuery === "" ||
        ticket.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.date.includes(searchQuery);

      const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
      const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tickets, searchQuery, filterPriority, filterStatus]);

  // Get unique priorities and statuses for filter dropdowns
  const priorities = useMemo(() => {
    return Array.from(new Set(tickets.map((t) => t.priority)));
  }, [tickets]);

  const statuses = useMemo(() => {
    return Array.from(new Set(tickets.map((t) => t.status)));
  }, [tickets]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Table columns
  const columns: TableColumn<UserTicket>[] = [
    {
      key: "ticketNo",
      label: "টিকেট নম্বর",
      render: (ticket) => (
        <span className="font-mono font-semibold">{ticket.ticketNo}</span>
      ),
    },
    {
      key: "date",
      label: "তারিখ",
      render: (ticket) => formatDate(ticket.date),
    },
    {
      key: "subject",
      label: "বিষয়",
      className: "font-medium",
    },
    {
      key: "priority",
      label: "অগ্রাধিকার",
      render: (ticket) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${ticket.priority === "উচ্চ"
            ? "bg-red-100 text-red-800"
            : ticket.priority === "মধ্যম"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
            }`}
        >
          {ticket.priority}
        </span>
      ),
    },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (ticket) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${ticket.status === "সমাধান"
            ? "bg-green-100 text-green-800"
            : ticket.status === "প্রক্রিয়াধীন"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {ticket.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "কার্যক্রম",
      render: (ticket) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTicket(ticket);
          }}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
        >
          <MessageSquare className="w-4 h-4" />
          বিস্তারিত
        </button>
      ),
    },
  ];

  // Generate ticket number
  const generateTicketNo = () => {
    const count = tickets.length + 1;
    return `TKT-${String(count).padStart(3, "0")}`;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      return;
    }

    const newTicket: UserTicket = {
      id: tickets.length + 1,
      ticketNo: generateTicketNo(),
      date: new Date().toISOString().split("T")[0],
      subject: formData.subject,
      priority: formData.priority,
      status: "খোলা",
      description: formData.description,
    };

    setTickets([newTicket, ...tickets]);
    setFormData({ subject: "", priority: "মধ্যম", description: "" });
    setShowTicketModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-[12rem] sm:pb-[7rem] overflow-x-hidden">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Ticket className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">টিকেট ইতিহাস</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTicketModal(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              নতুন টিকেট
            </motion.button>
          </div>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="অনুসন্ধান করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">সব অগ্রাধিকার</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">সব স্ট্যাটাস</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-primary-50 rounded-lg px-4 py-2">
              <p className="text-sm text-primary-600">মোট টিকেট</p>
              <p className="text-xl font-bold text-primary-600">{filteredTickets.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg px-4 py-2">
              <p className="text-sm text-yellow-600">খোলা</p>
              <p className="text-xl font-bold text-yellow-600">
                {filteredTickets.filter((t) => t.status === "খোলা").length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-600">প্রক্রিয়াধীন</p>
              <p className="text-xl font-bold text-blue-600">
                {filteredTickets.filter((t) => t.status === "প্রক্রিয়াধীন").length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg px-4 py-2">
              <p className="text-sm text-green-600">সমাধান</p>
              <p className="text-xl font-bold text-green-600">
                {filteredTickets.filter((t) => t.status === "সমাধান").length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tickets Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Table
            data={filteredTickets}
            columns={columns}
            emptyMessage="কোন টিকেট পাওয়া যায়নি"
          />
        </motion.div>
      </div>

      {/* Ticket Request Modal */}
      <AnimatePresence>
        {showTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowTicketModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">নতুন টিকেট</h3>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিষয় *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="টিকেটের বিষয় লিখুন"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অগ্রাধিকার
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="নিম্ন">নিম্ন</option>
                    <option value="মধ্যম">মধ্যম</option>
                    <option value="উচ্চ">উচ্চ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিবরণ *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="আপনার সমস্যা বা প্রশ্নের বিস্তারিত বিবরণ লিখুন"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    টিকেট তৈরি করুন
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">টিকেট বিস্তারিত</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">টিকেট নম্বর</p>
                    <p className="font-semibold text-gray-900 font-mono">{selectedTicket.ticketNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">তারিখ</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedTicket.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">অগ্রাধিকার</p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${selectedTicket.priority === "উচ্চ"
                        ? "bg-red-100 text-red-800"
                        : selectedTicket.priority === "মধ্যম"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                        }`}
                    >
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">স্ট্যাটাস</p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${selectedTicket.status === "সমাধান"
                        ? "bg-green-100 text-green-800"
                        : selectedTicket.status === "প্রক্রিয়াধীন"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">বিষয়</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">বিবরণ</p>
                  <p className="text-gray-900 bg-gray-50 rounded-lg p-4">{selectedTicket.description}</p>
                </div>

                {selectedTicket.response && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">প্রতিক্রিয়া</p>
                    <p className="text-gray-900 bg-primary-50 rounded-lg p-4 border border-primary-200">
                      {selectedTicket.response}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </div>
  );
}

