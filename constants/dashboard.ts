import {
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  Phone,
  Ticket
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
  { id: 0, label: "মোট সঞ্চয়", icon: Wallet, route: "/dashboard" },
  { id: 1, label: "মোট বিনিয়োগ", icon: TrendingUp, route: "/dashboard/total-investment" },
  { id: 2, label: "জমা", icon: ArrowDownCircle, route: "/dashboard/deposit" },
  { id: 3, label: "উত্তোলন", icon: ArrowUpCircle, route: "/dashboard/withdrawal" },
  { id: 4, label: "টিকেট ইতিহাস", icon: Ticket, route: "/dashboard/ticket-history" },
  { id: 5, label: "কোম্পানির ইতিহাস", icon: Building2, route: "/dashboard/company-history" },
  { id: 6, label: "যোগাযোগের তথ্য", icon: Phone, route: "/dashboard/contact" }
];

// Dashboard statistics cards data
export const DASHBOARD_STATS = [
  {
    label: "টোটাল বিনিয়োগ",
    value: "৳ 85,000",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-700",
  },
  {
    label: "টোটাল জমা",
    value: "৳ 1,25,000",
    icon: ArrowDownCircle,
    color: "from-green-500 to-green-700",
  },
  {
    label: "টোটাল উত্তোলন",
    value: "৳ 40,000",
    icon: ArrowUpCircle,
    color: "from-blue-500 to-blue-700",
  },
  {
    label: "টোটাল টিকেট",
    value: "12",
    icon: Ticket,
    color: "from-orange-500 to-orange-700",
  },
];

// Investment data for total investment page
export interface Investment {
  id: number;
  date: string;
  amount: number;
  type: string;
  status: string;
  description: string;
}

export const MOCK_INVESTMENTS: Investment[] = [
  { id: 1, date: "2024-01-15", amount: 15000, type: "মাসিক", status: "সক্রিয়", description: "মাসিক বিনিয়োগ পরিকল্পনা" },
  { id: 2, date: "2024-01-20", amount: 20000, type: "বার্ষিক", status: "সক্রিয়", description: "বার্ষিক বিনিয়োগ পরিকল্পনা" },
  { id: 3, date: "2024-02-10", amount: 12000, type: "মাসিক", status: "সক্রিয়", description: "মাসিক বিনিয়োগ পরিকল্পনা" },
  { id: 4, date: "2024-02-25", amount: 18000, type: "মাসিক", status: "সম্পন্ন", description: "মাসিক বিনিয়োগ পরিকল্পনা" },
  { id: 5, date: "2024-03-05", amount: 25000, type: "বার্ষিক", status: "সক্রিয়", description: "বার্ষিক বিনিয়োগ পরিকল্পনা" },
  { id: 6, date: "2024-03-18", amount: 10000, type: "মাসিক", status: "সক্রিয়", description: "মাসিক বিনিয়োগ পরিকল্পনা" },
  { id: 7, date: "2024-04-02", amount: 15000, type: "মাসিক", status: "সম্পন্ন", description: "মাসিক বিনিয়োগ পরিকল্পনা" },
  { id: 8, date: "2024-04-20", amount: 22000, type: "বার্ষিক", status: "সক্রিয়", description: "বার্ষিক বিনিয়োগ পরিকল্পনা" },
];

// Date-wise investment data for bar graph
export interface DateWiseInvestment {
  date: string;
  amount: number;
}

export const DATE_WISE_INVESTMENTS: DateWiseInvestment[] = [
  { date: "2024-01-15", amount: 15000 },
  { date: "2024-01-20", amount: 20000 },
  { date: "2024-02-10", amount: 12000 },
  { date: "2024-02-25", amount: 18000 },
  { date: "2024-03-05", amount: 25000 },
  { date: "2024-03-18", amount: 10000 },
  { date: "2024-04-02", amount: 15000 },
  { date: "2024-04-20", amount: 22000 },
];

