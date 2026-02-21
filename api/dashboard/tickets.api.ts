import { apiClient } from "@/lib/api/axios";
import type {
  TicketSchedule,
  TicketScheduleListResponse,
  TicketPurchase,
  TicketPurchaseListResponse,
} from "./types/dashboard.api";

const SCHEDULES_BASE = "/api/tickets/schedules";
const PURCHASES_BASE = "/api/tickets/purchases";

/**
 * Get Active Ticket Schedules - GET /api/tickets/schedules/active/
 * API returns a direct array; normalized to list response for table.
 */
export async function getActiveSchedules(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<TicketScheduleListResponse> {
  const { data } = await apiClient.get<
    TicketSchedule[] | TicketScheduleListResponse
  >(`${SCHEDULES_BASE}/active/`, { params });
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
 * Get All Schedule Tickets - GET /api/tickets/schedules/
 */
export async function getAllSchedules(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<TicketScheduleListResponse> {
  const { data } = await apiClient.get<TicketScheduleListResponse>(
    `${SCHEDULES_BASE}/`,
    { params }
  );
  return data;
}

/**
 * Get My Purchases - GET /api/tickets/purchases/my_purchases/
 * Normalized to list response (handles array or paginated).
 */
export async function getMyPurchases(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<TicketPurchaseListResponse> {
  const { data } = await apiClient.get<
    TicketPurchase[] | TicketPurchaseListResponse
  >(`${PURCHASES_BASE}/my_purchases/`, { params });
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
 * Purchase Ticket - POST /api/tickets/purchases/
 */
export async function purchaseTicket(ticketId: number): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(`${PURCHASES_BASE}/`, {
    ticket_id: ticketId,
  });
  return data;
}
