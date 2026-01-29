import { apiClient } from "@/lib/api/axios";
import type {
  TicketSchedule,
  TicketScheduleListResponse,
  TicketSchedulePayload,
} from "./types/admin.api";

const SCHEDULES_BASE = "/api/tickets/schedules";
const PURCHASES_BASE = "/api/tickets/purchases";

/**
 * Create Ticket Schedule - POST /api/tickets/schedules/
 */
export async function createTicketSchedule(
  payload: TicketSchedulePayload,
): Promise<TicketScheduleListResponse> {
  const { data } = await apiClient.post<TicketScheduleListResponse>(
    `${SCHEDULES_BASE}/`,
    payload,
  );
  return data;
}

/**
 * Get All Ticket Schedules - GET /api/tickets/schedules/
 */
export async function getAllTicketSchedules(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<TicketScheduleListResponse> {
  const { data } = await apiClient.get<TicketScheduleListResponse>(
    `${SCHEDULES_BASE}/`,
    { params },
  );
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }
  return data;
}

/**
 * Update Ticket Schedule - PUT /api/tickets/schedules/:id/
 */
export async function updateTicketSchedule(
  id: number,
  payload: Partial<TicketSchedulePayload>,
): Promise<TicketSchedule> {
  const { data } = await apiClient.put<TicketSchedule>(
    `${SCHEDULES_BASE}/${id}/`,
    payload,
  );
  return data;
}

/**
 * Delete Ticket Schedule - DELETE /api/tickets/schedules/:id/
 */
export async function deleteTicketSchedule(id: number): Promise<void> {
  await apiClient.delete(`${SCHEDULES_BASE}/${id}/`);
}

/**
 * Get All Active Ticket Schedules - GET /api/tickets/schedules/active/
 */
export async function getActiveTicketSchedules(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<TicketScheduleListResponse> {
  const { data } = await apiClient.get<TicketScheduleListResponse>(
    `${SCHEDULES_BASE}/active/`,
    { params },
  );
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }
  return data;
}

/**
 * Get All Announced Ticket Schedules - GET /api/tickets/schedules/announced/
 * API returns a direct array; normalized to TicketScheduleListResponse for table.
 */
export async function getAnnouncedTicketSchedules(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<TicketScheduleListResponse> {
  const { data } = await apiClient.get<
    TicketSchedule[] | TicketScheduleListResponse
  >(`${SCHEDULES_BASE}/announced/`, { params });
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }
  return data;
}

/**
 * Get All Purchases - GET /api/tickets/purchases/
 */
export async function getAllTicketPurchases(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<TicketScheduleListResponse> {
  const { data } = await apiClient.get<TicketScheduleListResponse>(
    `${PURCHASES_BASE}/`,
    { params },
  );
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }
  return data;
}
