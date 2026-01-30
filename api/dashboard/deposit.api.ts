import { apiClient } from "@/lib/api/axios";
import type {
  Deposit,
  DepositListResponse,
  ApproveDepositResponse,
} from "./types/dashboard.api";

const DEPOSITS_BASE = "/api/wallet/deposits";

/**
 * Create deposit request - POST /api/wallet/deposits/
 * Payload: form-data with amount (string) and proof_document (file)
 */
export async function createDepositRequest(
  amount: string,
  proof_document: File
): Promise<Deposit> {
  const formData = new FormData();
  formData.append("amount", amount);
  formData.append("proof_document", proof_document);

  const { data } = await apiClient.post<Deposit>(`${DEPOSITS_BASE}/`, formData);
  return data;
}

/**
 * Get all deposit requests (current user) - GET /api/wallet/deposits/
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
 * Approve deposit request (SUPPORT role only) - POST /api/wallet/deposits/:id/approve/
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
