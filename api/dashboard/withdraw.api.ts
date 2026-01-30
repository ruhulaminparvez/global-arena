import { apiClient } from "@/lib/api/axios";
import type {
  Withdrawal,
  WithdrawalListResponse,
  CreateWithdrawalPayload,
  ApproveWithdrawalResponse,
} from "./types/dashboard.api";

const WITHDRAWALS_BASE = "/api/wallet/withdrawals";

/**
 * Create withdrawal request - POST /api/wallet/withdrawals/
 */
export async function createWithdrawalRequest(
  payload: CreateWithdrawalPayload
): Promise<Withdrawal> {
  const { data } = await apiClient.post<Withdrawal>(
    `${WITHDRAWALS_BASE}/`,
    payload
  );
  return data;
}

/**
 * Get all withdrawal requests (current user) - GET /api/wallet/withdrawals/
 * Optional status filter: ?status=PENDING | APPROVED | REJECTED
 */
export async function getWithdrawals(params?: {
  status?: string;
  [key: string]: string | number | undefined;
}): Promise<WithdrawalListResponse> {
  const { data } = await apiClient.get<WithdrawalListResponse>(
    `${WITHDRAWALS_BASE}/`,
    { params }
  );
  return data;
}

/**
 * Approve withdrawal request (SUPPORT role only) - POST /api/wallet/withdrawals/:id/approve/
 */
export async function approveWithdrawal(
  id: number
): Promise<ApproveWithdrawalResponse> {
  const { data } = await apiClient.post<ApproveWithdrawalResponse>(
    `${WITHDRAWALS_BASE}/${id}/approve/`,
    {}
  );
  return data;
}
