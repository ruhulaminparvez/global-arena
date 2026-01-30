import { apiClient } from "@/lib/api/axios";
import type {
  Deposit,
  DepositListResponse,
  RejectDepositPayload,
  ApproveDepositResponse,
  RejectDepositResponse,
} from "./types/admin.api";

const DEPOSITS_BASE = "/api/wallet/deposits";

/**
 * Get all deposit requests - GET /api/wallet/deposits/
 * Optional status filter: ?status=PENDING | APPROVED | REJECTED
 */
export async function getDeposits(params?: {
  status?: string;
  [key: string]: string | number | undefined;
}): Promise<DepositListResponse> {
  const { data } = await apiClient.get<DepositListResponse>(
    `${DEPOSITS_BASE}/`,
    { params }
  );
  return data;
}

/**
 * Get particular deposit detail - GET /api/wallet/deposits/:id/
 */
export async function getDepositById(id: number): Promise<Deposit> {
  const { data } = await apiClient.get<Deposit>(`${DEPOSITS_BASE}/${id}/`);
  return data;
}

/**
 * Approve deposit - POST /api/wallet/deposits/:id/approve/
 */
export async function approveDeposit(
  id: number
): Promise<ApproveDepositResponse> {
  const { data } = await apiClient.post<ApproveDepositResponse>(
    `${DEPOSITS_BASE}/${id}/approve/`,
    {}
  );
  return data;
}

/**
 * Reject deposit - POST /api/wallet/deposits/:id/reject/
 */
export async function rejectDeposit(
  id: number,
  payload: RejectDepositPayload
): Promise<RejectDepositResponse> {
  const { data } = await apiClient.post<RejectDepositResponse>(
    `${DEPOSITS_BASE}/${id}/reject/`,
    payload
  );
  return data;
}
