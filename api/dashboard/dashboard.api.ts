import { apiClient } from "@/lib/api/axios";
import type {
  DashboardSummary,
  TicketAnalyticsItem,
  MyWallet,
} from "./types/dashboard.api";

/**
 * Get dashboard summary - GET /api/dashboard/summary/
 * For SUPPORT and ADMIN roles.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>(
    "/api/dashboard/summary/"
  );
  return data;
}

/**
 * Get ticket analytics - GET /api/dashboard/tickets/
 * For SUPPORT and ADMIN roles.
 */
export async function getTicketAnalytics(): Promise<TicketAnalyticsItem[]> {
  const { data } = await apiClient.get<TicketAnalyticsItem[]>(
    "/api/dashboard/tickets/"
  );
  return Array.isArray(data) ? data : [];
}

/**
 * Get current user's wallet - GET /api/wallet/wallets/my_wallet/
 */
export async function getMyWallet(): Promise<MyWallet> {
  const { data } = await apiClient.get<MyWallet>(
    "/api/wallet/wallets/my_wallet/"
  );
  return data;
}
