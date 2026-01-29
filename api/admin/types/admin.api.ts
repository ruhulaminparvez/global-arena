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

/**
 * User & Profile types for admin API
 */

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export type UserRole = "SUPPORT" | "ADMIN" | "USER" | string;

export interface Profile {
  id: number;
  user: User;
  role?: UserRole;
  mobile?: string;
  nid?: string;
  [key: string]: unknown;
}

export interface UpdateProfilePayload {
  role?: UserRole;
  mobile?: string;
}

export interface CreateSupportUserPayload {
  username: string;
  password: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
  nid: string;
  mobile: string;
  reference_username: string;
}
