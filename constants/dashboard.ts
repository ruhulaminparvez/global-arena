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

// Deposit data for deposit page
export interface Deposit {
  id: number;
  date: string;
  amount: number;
  method: string;
  transactionId: string;
  status: string;
  description?: string;
}

export const MOCK_DEPOSITS: Deposit[] = [
  { id: 1, date: "2024-01-10", amount: 5000, method: "ব্যাংক", transactionId: "TXN-001", status: "অনুমোদিত", description: "ব্যাংক ট্রান্সফার" },
  { id: 2, date: "2024-01-18", amount: 8000, method: "মোবাইল", transactionId: "TXN-002", status: "অনুমোদিত", description: "বিকাশ" },
  { id: 3, date: "2024-02-05", amount: 10000, method: "ব্যাংক", transactionId: "TXN-003", status: "বিবেচনাধীন", description: "ব্যাংক ট্রান্সফার" },
  { id: 4, date: "2024-02-15", amount: 6000, method: "মোবাইল", transactionId: "TXN-004", status: "অনুমোদিত", description: "নগদ" },
  { id: 5, date: "2024-03-02", amount: 12000, method: "ব্যাংক", transactionId: "TXN-005", status: "অনুমোদিত", description: "ব্যাংক ট্রান্সফার" },
  { id: 6, date: "2024-03-20", amount: 7000, method: "মোবাইল", transactionId: "TXN-006", status: "বিবেচনাধীন", description: "রকেট" },
  { id: 7, date: "2024-04-08", amount: 9000, method: "ব্যাংক", transactionId: "TXN-007", status: "অনুমোদিত", description: "ব্যাংক ট্রান্সফার" },
  { id: 8, date: "2024-04-25", amount: 15000, method: "মোবাইল", transactionId: "TXN-008", status: "অনুমোদিত", description: "নগদ" },
];

// Withdrawal data for withdrawal page
export interface Withdrawal {
  id: number;
  date: string;
  amount: number;
  method: string;
  accountNumber: string;
  status: string;
  description?: string;
}

export const MOCK_WITHDRAWALS: Withdrawal[] = [
  { id: 1, date: "2024-01-12", amount: 3000, method: "ব্যাংক", accountNumber: "ACC-001", status: "অনুমোদিত", description: "ব্যাংক উত্তোলন" },
  { id: 2, date: "2024-01-25", amount: 5000, method: "মোবাইল", accountNumber: "MOB-001", status: "অনুমোদিত", description: "বিকাশ" },
  { id: 3, date: "2024-02-08", amount: 4000, method: "ব্যাংক", accountNumber: "ACC-002", status: "বিবেচনাধীন", description: "ব্যাংক উত্তোলন" },
  { id: 4, date: "2024-02-20", amount: 2500, method: "মোবাইল", accountNumber: "MOB-002", status: "অনুমোদিত", description: "নগদ" },
  { id: 5, date: "2024-03-10", amount: 6000, method: "ব্যাংক", accountNumber: "ACC-003", status: "অনুমোদিত", description: "ব্যাংক উত্তোলন" },
  { id: 6, date: "2024-03-22", amount: 3500, method: "মোবাইল", accountNumber: "MOB-003", status: "বিবেচনাধীন", description: "রকেট" },
  { id: 7, date: "2024-04-05", amount: 4500, method: "ব্যাংক", accountNumber: "ACC-004", status: "অনুমোদিত", description: "ব্যাংক উত্তোলন" },
  { id: 8, date: "2024-04-18", amount: 7000, method: "মোবাইল", accountNumber: "MOB-004", status: "প্রত্যাখ্যান", description: "নগদ" },
];

// Ticket data for ticket history page
export interface UserTicket {
  id: number;
  ticketNo: string;
  date: string;
  subject: string;
  priority: string;
  status: string;
  description: string;
  response?: string;
}

export const MOCK_USER_TICKETS: UserTicket[] = [
  { id: 1, ticketNo: "TKT-001", date: "2024-01-15", subject: "সঞ্চয় সম্পর্কে প্রশ্ন", priority: "উচ্চ", status: "খোলা", description: "আমি আমার সঞ্চয়ের তথ্য জানতে চাই" },
  { id: 2, ticketNo: "TKT-002", date: "2024-01-20", subject: "বিনিয়োগ তথ্য", priority: "মধ্যম", status: "প্রক্রিয়াধীন", description: "বিনিয়োগের বিস্তারিত তথ্য প্রয়োজন", response: "আমরা আপনার অনুরোধটি প্রক্রিয়া করছি" },
  { id: 3, ticketNo: "TKT-003", date: "2024-02-05", subject: "অ্যাকাউন্ট সমস্যা", priority: "উচ্চ", status: "খোলা", description: "অ্যাকাউন্টে লগইন করতে পারছি না" },
  { id: 4, ticketNo: "TKT-004", date: "2024-02-12", subject: "পাসওয়ার্ড রিসেট", priority: "নিম্ন", status: "সমাধান", description: "পাসওয়ার্ড রিসেট করতে চাই", response: "আপনার পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে" },
  { id: 5, ticketNo: "TKT-005", date: "2024-03-10", subject: "জমা সম্পর্কে প্রশ্ন", priority: "মধ্যম", status: "প্রক্রিয়াধীন", description: "জমার প্রক্রিয়া সম্পর্কে জানতে চাই" },
  { id: 6, ticketNo: "TKT-006", date: "2024-03-25", subject: "উত্তোলন অনুমোদন", priority: "উচ্চ", status: "খোলা", description: "উত্তোলন অনুমোদনের জন্য আবেদন" },
  { id: 7, ticketNo: "TKT-007", date: "2024-04-08", subject: "সাধারণ প্রশ্ন", priority: "নিম্ন", status: "সমাধান", description: "সেবা সম্পর্কে সাধারণ তথ্য", response: "আমাদের সেবা সম্পর্কে বিস্তারিত তথ্য আপনার ইমেইলে পাঠানো হয়েছে" },
  { id: 8, ticketNo: "TKT-008", date: "2024-04-20", subject: "ট্রান্সাকশন সমস্যা", priority: "উচ্চ", status: "প্রক্রিয়াধীন", description: "ট্রান্সাকশন সম্পন্ন হয়নি" },
];

