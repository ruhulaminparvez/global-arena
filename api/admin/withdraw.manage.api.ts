import { apiClient } from "@/lib/api/axios";
import type {
  Withdrawal,
  WithdrawalListResponse,
  RejectWithdrawalPayload,
  ApproveWithdrawalResponse,
  RejectWithdrawalResponse,
} from "./types/admin.api";

const WITHDRAWALS_BASE = "/api/wallet/withdrawals";

/**
 * Get all withdrawal requests - GET /api/wallet/withdrawals/
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
 * Get particular withdrawal detail - GET /api/wallet/withdrawals/:id/
 */
export async function getWithdrawalById(id: number): Promise<Withdrawal> {
  const { data } = await apiClient.get<Withdrawal>(
    `${WITHDRAWALS_BASE}/${id}/`
  );
  return data;
}

/**
 * Approve withdrawal - POST /api/wallet/withdrawals/:id/approve/
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

/**
 * Reject withdrawal - POST /api/wallet/withdrawals/:id/reject/
 */
export async function rejectWithdrawal(
  id: number,
  payload: RejectWithdrawalPayload
): Promise<RejectWithdrawalResponse> {
  const { data } = await apiClient.post<RejectWithdrawalResponse>(
    `${WITHDRAWALS_BASE}/${id}/reject/`,
    payload
  );
  return data;
}
