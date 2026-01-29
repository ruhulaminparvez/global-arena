import { apiClient } from "@/lib/api/axios";
import type { DashboardSummary } from "./types/admin.api";

/**
 * Get dashboard summary - GET /api/dashboard/summary/
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>(
    "/api/dashboard/summary/"
  );
  return data;
}
