import { apiClient } from "@/lib/api/axios";
import type { MyChatRoom, ChatMessage } from "./types/dashboard.api";

const CHAT_BASE = "/api/chat/rooms";

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
