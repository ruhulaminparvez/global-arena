import { apiClient } from "@/lib/api/axios";
import type {
  DashboardSummary,
  TicketAnalyticsItem,
  MyWallet,
  WalletTransaction,
  RegistrationFeeStatus,
  FeePaymentPayload,
  FeePaymentResponse,
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

/**
 * Get wallet transactions - GET /api/wallet/wallets/transactions/
 */
export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  const { data } = await apiClient.get<WalletTransaction[]>(
    "/api/wallet/wallets/transactions/"
  );
  return Array.isArray(data) ? data : [];
}

/**
 * Check if user has paid registration fee - GET /api/accounts/profiles/check_registration_fee/
 */
export async function checkRegistrationFee(): Promise<RegistrationFeeStatus> {
  const { data } = await apiClient.get<RegistrationFeeStatus>(
    "/api/accounts/profiles/check_registration_fee/"
  );
  return data;
}

/**
 * Submit registration fee payment - POST /api/accounts/fee-payments/
 */
export async function submitFeePayment(
  payload: FeePaymentPayload
): Promise<FeePaymentResponse> {
  const { data } = await apiClient.post<FeePaymentResponse>(
    "/api/accounts/fee-payments/",
    payload
  );
  return data;
}

