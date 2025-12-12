import {
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Building2,
  Phone,
  LogOut,
} from "lucide-react";
import type { UserDashboardData, MenuItem } from "@/types/dashboard";

const USER_PHOTO = "/images/ruhul.jpg";

// Mock user data - replace with actual data from your API/context
export const MOCK_USER_DATA: UserDashboardData = {
  name: "আহমেদ হাসান",
  photo: USER_PHOTO,
  nid: "1234567890123",
  totalBalance: 125000,
  monthlySavings: [
    { month: "জানুয়ারি", amount: 10000 },
    { month: "ফেব্রুয়ারি", amount: 12000 },
    { month: "মার্চ", amount: 15000 },
    { month: "এপ্রিল", amount: 11000 },
    { month: "মে", amount: 13000 },
    { month: "জুন", amount: 14000 },
    { month: "জুলাই", amount: 16000 },
    { month: "আগস্ট", amount: 12000 },
    { month: "সেপ্টেম্বর", amount: 15000 },
    { month: "অক্টোবর", amount: 11000 },
    { month: "নভেম্বর", amount: 13000 },
    { month: "ডিসেম্বর", amount: 14000 },
  ],
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, label: "আপনার মোট সঞ্চয়", icon: Wallet },
  { id: 2, label: "আপনার মোট বিনিয়োগ", icon: TrendingUp },
  { id: 3, label: "জমা", icon: ArrowDownCircle },
  { id: 4, label: "উত্তোলন", icon: ArrowUpCircle },
  { id: 5, label: "সময়সূচি ইতিহাস", icon: Clock },
  { id: 6, label: "কোম্পানির ইতিহাস", icon: Building2 },
  { id: 7, label: "আমাদের সাথে যোগাযোগের তথ্য", icon: Phone },
  { id: 8, label: "লগআউট", icon: LogOut },
];

