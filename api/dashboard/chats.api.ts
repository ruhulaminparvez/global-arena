import { apiClient } from "@/lib/api/axios";
import type {
  MyChatRoom,
  ChatMessage,
  ChatRoomListResponse,
} from "./types/dashboard.api";

const CHAT_BASE = "/api/chat/rooms";

/**
 * Get all chat rooms - GET /api/chat/rooms/
 * Only available for SUPPORT and ADMIN roles.
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
 * Get my chat room - GET /api/chat/rooms/my_room/
 */
export async function getMyChatRoom(): Promise<MyChatRoom | null> {
  try {
    const { data } = await apiClient.get<MyChatRoom>(`${CHAT_BASE}/my_room/`);
    return data;
  } catch {
    return null;
  }
}

/**
 * Get particular room messages - GET /api/chat/rooms/:room_id/messages/
 */
export async function getRoomMessages(roomId: number): Promise<ChatMessage[]> {
  const { data } = await apiClient.get<
    ChatMessage[] | { results: ChatMessage[] }
  >(`${CHAT_BASE}/${roomId}/messages/`);
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

/**
 * Mark room as read - POST /api/chat/rooms/:room_id/mark_read
 */
export async function markRoomAsRead(roomId: number): Promise<void> {
  await apiClient.post(`${CHAT_BASE}/${roomId}/mark_read`);
}

/**
 * Send a message via REST - POST /api/chat/rooms/:room_id/send_message/
 */
export async function sendMessage(roomId: number, message: string): Promise<ChatMessage> {
  const { data } = await apiClient.post<ChatMessage>(
    `${CHAT_BASE}/${roomId}/send_message/`,
    { message }
  );
  return data;
}
