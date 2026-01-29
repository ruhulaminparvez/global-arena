import { apiClient } from "@/lib/api/axios";
import type {
  User,
  UserListResponse,
  Profile,
  UpdateProfilePayload,
  CreateSupportUserPayload,
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
