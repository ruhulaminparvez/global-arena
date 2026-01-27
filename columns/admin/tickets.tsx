"use client";

import { TableColumn } from "@/components/Table";

type Ticket = {
  id: number;
  ticketNo: string;
  userName: string;
  subject: string;
  priority: string;
  date: string;
  status: string;
};

export const getTicketsColumns = (): TableColumn<Ticket>[] => [
  {
    key: "ticketNo",
    label: "টিকেট নম্বর",
    render: (ticket) => <span className="font-mono font-semibold">{ticket.ticketNo}</span>,
  },
  {
    key: "userName",
    label: "ব্যবহারকারীর নাম",
  },
  {
    key: "subject",
    label: "বিষয়",
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
    key: "date",
    label: "তারিখ",
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
    render: () => (
      <div className="flex gap-2">
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          দেখুন
        </button>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          উত্তর দিন
        </button>
      </div>
    ),
  },
];
