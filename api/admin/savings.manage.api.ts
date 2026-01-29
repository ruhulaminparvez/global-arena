import { apiClient } from "@/lib/api/axios";
import type {
  SavingPlanListResponse,
  SavingTransactionListResponse,
} from "./types/admin.api";

const SAVINGS_BASE = "/api/savings";

export interface SavingsPlansParams {
  search?: string;
  page?: number;
  page_size?: number;
  is_completed?: boolean;
  user?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface SavingsTransactionsParams {
  search?: string;
  page?: number;
  page_size?: number;
  plan?: number;
  user?: number;
  [key: string]: string | number | undefined;
}

/**
 * Get all saving plans - GET /api/savings/plans/
 */
export async function getSavingsPlans(
  params?: SavingsPlansParams
): Promise<SavingPlanListResponse> {
  const { data } = await apiClient.get<SavingPlanListResponse>(
    `${SAVINGS_BASE}/plans/`,
    { params }
  );
  return data;
}

/**
 * Get all saving transactions - GET /api/savings/transactions/
 */
export async function getSavingsTransactions(
  params?: SavingsTransactionsParams
): Promise<SavingTransactionListResponse> {
  const { data } = await apiClient.get<SavingTransactionListResponse>(
    `${SAVINGS_BASE}/transactions/`,
    { params }
  );
  return data;
}
