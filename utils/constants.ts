import {
  Wallet,
  TrendingUp,
  CreditCard,
  FileText,
  User,
  Settings,
  HelpCircle,
  PiggyBank,
  BarChart3,
  DollarSign,
  ArrowUpDown,
} from "lucide-react";

export interface RouteOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgColor: string;
}

export const dashboardRoutes: RouteOption[] = [
  {
    id: "savings",
    title: "Savings",
    description: "Manage your savings",
    icon: PiggyBank,
    href: "/dashboard/savings",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "investments",
    title: "Investments",
    description: "View your investments",
    icon: TrendingUp,
    href: "/dashboard/investments",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: "loans",
    title: "Loans",
    description: "Apply and manage loans",
    icon: CreditCard,
    href: "/dashboard/loans",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "View all transactions",
    icon: ArrowUpDown,
    href: "/dashboard/transactions",
    color: "text-lime-600",
    bgColor: "bg-lime-50",
  },
  {
    id: "profile",
    title: "Profile",
    description: "View your profile",
    icon: User,
    href: "/dashboard/profile",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  {
    id: "settings",
    title: "Settings",
    description: "App settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
];

export interface StatCard {
  id: string;
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const dashboardStats: StatCard[] = [
  {
    id: "totalSavings",
    title: "Total Savings",
    value: "৳ 50,000",
    icon: Wallet,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: {
      value: "+12%",
      isPositive: true,
    },
  },
  {
    id: "totalInvestments",
    title: "Total Investments",
    value: "৳ 25,000",
    icon: BarChart3,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    trend: {
      value: "+8%",
      isPositive: true,
    },
  },
  {
    id: "activeLoans",
    title: "Active Loans",
    value: "৳ 10,000",
    icon: CreditCard,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: "monthlyIncome",
    title: "Monthly Income",
    value: "৳ 30,000",
    icon: DollarSign,
    color: "text-lime-600",
    bgColor: "bg-lime-50",
    trend: {
      value: "+5%",
      isPositive: true,
    },
  },
];
