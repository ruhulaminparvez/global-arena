import { LucideIcon } from "lucide-react";

/**
 * Monthly savings data point
 */
export interface MonthlySavingsData {
  month: string;
  amount: number;
}

/**
 * User dashboard data
 */
export interface UserDashboardData {
  name: string;
  photo?: string;
  nid: string;
  totalBalance: number;
  monthlySavings: MonthlySavingsData[];
}

/**
 * Menu item structure
 */
export interface MenuItem {
  id: number;
  label: string;
  icon: LucideIcon;
  route?: string;
  action?: () => void;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalSavings: number;
  totalInvestment: number;
  monthlyDeposit: number;
  monthlyWithdrawal: number;
}

/**
 * Transaction types
 */
export type TransactionType = "deposit" | "withdrawal" | "investment";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description?: string;
  status: "pending" | "completed" | "failed";
}

/**
 * Schedule history entry
 */
export interface ScheduleHistory {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: "pending" | "completed" | "cancelled";
}

/**
 * Company history entry
 */
export interface CompanyHistory {
  id: string;
  name: string;
  description?: string;
  date: string;
  type: "announcement" | "update" | "event";
}

/**
 * Contact information
 */
export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

