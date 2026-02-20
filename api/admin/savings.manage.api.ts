import { apiClient } from "@/lib/api/axios";
import type {
  SavingPlan,
  SavingPlanListResponse,
  SavingTransactionListResponse,
} from "./types/admin.api";

export interface CreateSavingPlanForUserPayload {
  user_id: number;
  monthly_amount: number;
  duration_months: number;
}

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
 * Create saving plan for a user - POST /api/savings/plans/create_for_user/
 */
export async function createSavingPlanForUser(
  payload: CreateSavingPlanForUserPayload
): Promise<SavingPlan> {
  const { data } = await apiClient.post<SavingPlan>(
    `${SAVINGS_BASE}/plans/create_for_user/`,
    payload
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
