"use client";

import { MessageSquare } from "lucide-react";
import { TableColumn } from "@/components/Table";
import type { UserTicket } from "@/constants/dashboard";

interface TicketHistoryColumnsProps {
  formatDate: (dateString: string) => string;
  setSelectedTicket: (ticket: UserTicket) => void;
}

export const getTicketHistoryColumns = ({
  formatDate,
  setSelectedTicket,
}: TicketHistoryColumnsProps): TableColumn<UserTicket>[] => [
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
