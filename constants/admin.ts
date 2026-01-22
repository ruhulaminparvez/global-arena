import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  MessageSquare,
  Ticket,
  Users,
  LogOut,
} from "lucide-react";
import type { MenuItem } from "@/types/dashboard";

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { id: 0, label: "ড্যাশবোর্ড অ্যান্ড রিপোর্টস", icon: LayoutDashboard, route: "/admin" },
  { id: 1, label: "সঞ্চয় ম্যানেজমেন্ট", icon: Wallet, route: "/admin/savings" },
  { id: 2, label: "বিনিয়োগ ম্যানেজমেন্ট", icon: TrendingUp, route: "/admin/investments" },
  { id: 3, label: "জমা ম্যানেজমেন্ট", icon: ArrowDownCircle, route: "/admin/deposits" },
  { id: 4, label: "উত্তোলন ম্যানেজমেন্ট", icon: ArrowUpCircle, route: "/admin/withdrawals" },
  { id: 6, label: "যোগাযোগ ম্যানেজমেন্ট", icon: MessageSquare, route: "/admin/communications" },
  { id: 7, label: "টিকেট ম্যানেজমেন্ট", icon: Ticket, route: "/admin/tickets" },
  { id: 8, label: "ইউজার ম্যানেজমেন্ট", icon: Users, route: "/admin/users" },
  { id: 9, label: "লগআউট", icon: LogOut },
];
