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

/**
 * Chat room & message types for admin API
 */

export interface ChatRoom {
  id: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
  last_message?: string;
  unread_count?: number;
  [key: string]: unknown;
}

export interface ChatRoomListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatRoom[];
}

export interface ChatMessage {
  id: number;
  content?: string;
  sender?: number | string;
  sender_username?: string;
  created_at?: string;
  is_read?: boolean;
  [key: string]: unknown;
}

export type ChatMessagesResponse = ChatMessage[] | { count: number; next: string | null; previous: string | null; results: ChatMessage[] };

/**
 * Dashboard summary for admin (GET /api/dashboard/summary/)
 */
export interface DashboardSummary {
  users: { total: number };
  wallet: {
    total_balance: number;
    total_locked: number;
    available_pool: number;
  };
  pending_requests: {
    deposits: number;
    withdrawals: number;
    total: number;
  };
  tickets: {
    active_schedules: number;
    total_purchases: number;
  };
}

/**
 * Savings plan (GET /api/savings/plans/)
 */
export interface SavingPlan {
  id: number;
  user: number;
  monthly_amount: string;
  duration_months: number;
  start_date: string;
  is_completed: boolean;
  is_mature: boolean;
  total_saved: number;
  months_elapsed: number;
  months_remaining: number;
  transactions: unknown[];
  created_at: string;
  updated_at: string;
}

export interface SavingPlanListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SavingPlan[];
}

/**
 * Savings transaction (GET /api/savings/transactions/)
 */
export interface SavingTransaction {
  id: number;
  plan?: number;
  amount?: string;
  transaction_date?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface SavingTransactionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SavingTransaction[];
}

/**
 * Deposit request (GET /api/wallet/deposits/ and /api/wallet/deposits/:id/)
 */
export type DepositStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Deposit {
  id: number;
  user: string;
  amount: string;
  status: DepositStatus;
  status_display: string;
  proof_document: string | null;
  admin_notes: string | null;
  approved_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface DepositListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Deposit[];
}

export interface RejectDepositPayload {
  reason: string;
}

export interface ApproveDepositResponse {
  status: string;
}

export interface RejectDepositResponse {
  status: string;
}
