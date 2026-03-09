import { apiClient } from "@/lib/api/axios";
import type {
  ChatRoomListResponse,
  ChatRoom,
  ChatMessage,
} from "./types/admin.api";

const CHAT_BASE = "/api/chat/rooms";

/**
 * Get all chat rooms - GET /api/chat/rooms/
 */
export async function getChatRooms(params?: {
  search?: string;
  [key: string]: string | number | undefined;
}): Promise<ChatRoomListResponse> {
  const { data } = await apiClient.get<ChatRoomListResponse>(
    `${CHAT_BASE}/`,
    { params }
  );
  return data;
}

/**
 * Get particular room messages - GET /api/chat/rooms/:id/messages
 */
export async function getRoomMessages(roomId: number): Promise<ChatMessage[]> {
  const { data } = await apiClient.get<ChatMessage[] | { results: ChatMessage[] }>(
    `${CHAT_BASE}/${roomId}/messages`
  );
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

/**
 * Mark room as read - POST /api/chat/rooms/:id/mark_read
 */
export async function markRoomAsRead(roomId: number): Promise<void> {
  await apiClient.post(`${CHAT_BASE}/${roomId}/mark_read`);
}

/**
 * Send a message via REST - POST /api/chat/rooms/:id/send_message/
 */
export async function sendMessage(roomId: number, message: string): Promise<ChatMessage> {
  const { data } = await apiClient.post<ChatMessage>(
    `${CHAT_BASE}/${roomId}/send_message/`,
    { message }
  );
  return data;
}

/**
 * Admin: Get or Create Room for a specific user - POST /api/chat/rooms/admin_get_or_create/
 */
export async function getOrCreateRoomForUser(userId: number): Promise<ChatRoom> {
  const { data } = await apiClient.post<ChatRoom>(
    `${CHAT_BASE}/admin_get_or_create/`,
    { user_id: userId }
  );
  return data;
}
