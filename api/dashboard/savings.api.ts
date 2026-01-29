import { apiClient } from "@/lib/api/axios";
import type {
  SavingPlan,
  SavingPlanListResponse,
  SavingTransaction,
} from "@/api/admin/types/admin.api";

const SAVINGS_BASE = "/api/savings";

/** Payload for creating a saving plan */
export interface CreateSavingPlanPayload {
  monthly_amount: number;
  duration_months: number;
}

/** Params for listing savings plans (paginated) */
export interface SavingsPlansListParams {
  page?: number;
  page_size?: number;
}

/**
 * Create a new saving plan - POST /api/savings/plans/
 * Minimum monthly_amount: 100, minimum duration_months: 36
 */
export async function createSavingPlan(
  payload: CreateSavingPlanPayload
): Promise<SavingPlan> {
  const { data } = await apiClient.post<SavingPlan>(
    `${SAVINGS_BASE}/plans/`,
    payload
  );
  return data;
}

/**
 * List all savings plans (paginated) - GET /api/savings/plans/
 */
export async function getSavingsPlans(
  params?: SavingsPlansListParams
): Promise<SavingPlanListResponse> {
  const { data } = await apiClient.get<SavingPlanListResponse>(
    `${SAVINGS_BASE}/plans/`,
    { params }
  );
  return data;
}

/**
 * Get current user's saving plans - GET /api/savings/plans/my_plans/
 */
export async function getMyPlans(): Promise<SavingPlan[]> {
  const { data } = await apiClient.get<SavingPlan[]>(
    `${SAVINGS_BASE}/plans/my_plans/`
  );
  return data;
}

/**
 * Get transactions for a specific plan - GET /api/savings/plans/{{plan_id}}/transactions/
 */
export async function getPlanTransactions(
  planId: number
): Promise<SavingTransaction[]> {
  const { data } = await apiClient.get<SavingTransaction[]>(
    `${SAVINGS_BASE}/plans/${planId}/transactions/`
  );
  return data;
}
