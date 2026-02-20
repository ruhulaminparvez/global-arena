import { apiClient } from "@/lib/api/axios";
import type {
  SavingPlan,
  SavingTransaction,
} from "@/api/admin/types/admin.api";

const SAVINGS_BASE = "/api/savings";

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
