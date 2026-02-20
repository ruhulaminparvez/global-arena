import { apiClient } from "@/lib/api/axios";
import type {
  User,
  UserListResponse,
  Profile,
  UpdateProfilePayload,
  CreateSupportUserPayload,
  FeePaymentListResponse,
  FeePaymentActionResponse,
  FeePaymentStatus,
} from "./types/admin.api";

const ACCOUNTS_BASE = "/api/accounts";

/**
 * Get user list - GET /api/accounts/users/
 */
export async function getUsers(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<UserListResponse> {
  const { data } = await apiClient.get<UserListResponse>(
    `${ACCOUNTS_BASE}/users/`,
    { params }
  );
  return data;
}

/**
 * Get particular user profile detail - GET /api/accounts/profiles/:id/
 */
export async function getUserProfile(id: number): Promise<Profile> {
  const { data } = await apiClient.get<Profile>(
    `${ACCOUNTS_BASE}/profiles/${id}/`
  );
  return data;
}

/**
 * Update particular user profile - PATCH /api/accounts/profiles/:id/
 */
export async function updateUserProfile(
  id: number,
  payload: UpdateProfilePayload
): Promise<Profile> {
  const { data } = await apiClient.patch<Profile>(
    `${ACCOUNTS_BASE}/profiles/${id}/`,
    payload
  );
  return data;
}

/**
 * Create support user - POST /api/accounts/users/
 */
export async function createSupportUser(
  payload: CreateSupportUserPayload
): Promise<User> {
  const { data } = await apiClient.post<User>(
    `${ACCOUNTS_BASE}/users/`,
    payload
  );
  return data;
}

/**
 * Get all registration fee payments - GET /api/accounts/fee-payments/
 */
export async function getFeePayments(params?: {
  status?: FeePaymentStatus;
}): Promise<FeePaymentListResponse> {
  const { data } = await apiClient.get<FeePaymentListResponse>(
    `${ACCOUNTS_BASE}/fee-payments/`,
    { params }
  );
  return data;
}

/**
 * Approve a registration fee payment - POST /api/accounts/fee-payments/:id/approve/
 */
export async function approveFeePayment(id: number): Promise<FeePaymentActionResponse> {
  const { data } = await apiClient.post<FeePaymentActionResponse>(
    `${ACCOUNTS_BASE}/fee-payments/${id}/approve/`
  );
  return data;
}

/**
 * Reject a registration fee payment - POST /api/accounts/fee-payments/:id/reject/
 */
export async function rejectFeePayment(id: number): Promise<FeePaymentActionResponse> {
  const { data } = await apiClient.post<FeePaymentActionResponse>(
    `${ACCOUNTS_BASE}/fee-payments/${id}/reject/`
  );
  return data;
}
