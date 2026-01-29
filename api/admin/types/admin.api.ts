/**
 * Ticket Schedule types for admin API
 */

export type AgreementType = "LONG" | "SHORT";

export interface TicketSchedulePayload {
  title: string;
  description: string;
  announcement_text: string;
  price: number;
  profit_percentage: number;
  agreement_type: AgreementType;
  duration_days: number;
  announcement_date: string;
  drop_time: string;
  event_date: string;
  is_active: boolean;
  is_confirmed: boolean;
  is_announced: boolean;
  max_tickets: number;
}

export interface TicketSchedule {
  id: number;
  title: string;
  description: string;
  announcement_text: string;
  price: string;
  profit_percentage: string;
  profit_amount: number;
  agreement_type: AgreementType;
  agreement_type_display: string;
  duration_days: number;
  announcement_date: string;
  drop_time: string;
  event_date: string;
  is_active: boolean;
  is_announced: boolean;
  is_confirmed: boolean;
  max_tickets: number;
  total_purchases: number;
  is_available: boolean;
  can_be_purchased: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketScheduleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TicketSchedule[];
}
