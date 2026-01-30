/**
 * Dashboard ticket/schedule types
 */

export type AgreementType = "LONG" | "SHORT";

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
 * Chat room & message types for dashboard
 */

export interface ChatRoomUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface MyChatRoom {
  id: number;
  user: ChatRoomUser;
  last_message: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

/** List response for GET /api/chat/rooms/ (SUPPORT/ADMIN only) */
export interface ChatRoomListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MyChatRoom[];
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

/**
 * Dashboard summary (GET /api/dashboard/summary/) - SUPPORT/ADMIN
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
 * Ticket analytics item (GET /api/dashboard/tickets/) - SUPPORT/ADMIN
 */
export interface TicketAnalyticsItem {
  id: number;
  title: string;
  price: number;
  is_active: boolean;
  is_confirmed: boolean;
  max_tickets: number;
  purchase_count: number;
  total_revenue: number | null;
}

/**
 * My wallet (GET /api/wallet/wallets/my_wallet/)
 */
export interface MyWallet {
  id: number;
  balance: string;
  locked_amount: string;
  available_balance: number;
  transactions: unknown[];
  created_at: string;
  updated_at: string;
}
