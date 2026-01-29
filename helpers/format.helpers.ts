/**
 * Extract numeric value from string like "৳ 12,50,000" or "1,234" or "45"
 * Removes currency symbols, spaces, and commas, then parses to integer
 * 
 * @param value - String value containing numbers (may include currency symbols and formatting)
 * @returns Extracted numeric value as integer, or 0 if parsing fails
 */
export function extractNumericValue(value: string): number {
  // Remove currency symbol, spaces, and commas, then parse
  const numericString = value.replace(/[৳,\s]/g, "");
  return parseInt(numericString, 10) || 0;
}

/**
 * Format number with currency symbol or comma formatting for display
 * Handles both currency values (starting with ৳) and regular numbers
 * 
 * @param value - Original string value (used to determine if it's currency)
 * @param animatedCount - The numeric value to format
 * @returns Formatted string with appropriate formatting (currency symbol or comma-separated)
 */
export function formatValue(value: string, animatedCount: number): string {
  const originalValue = value.trim();

  // Check if it's a currency value (starts with ৳)
  if (originalValue.startsWith("৳")) {
    return `৳ ${animatedCount.toLocaleString("bn-BD")}`;
  }

  // For non-currency values (like user count, ticket count)
  return animatedCount.toLocaleString("bn-BD");
}

/**
 * Format ISO date string for display
 *
 * @param dateStr - ISO date string or null/undefined
 * @returns Formatted date string (e.g. "28 Jan 2026") or "N/A"
 */
export function formatDate(
  dateStr: string | null | undefined
): string {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * User-like shape for display name (e.g. User from auth, or profile.user)
 */
export interface UserDisplayInput {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
}

/**
 * Get display name from a user-like object (first + last name, or username, or fallback)
 *
 * @param user - User object with optional first_name, last_name, username
 * @param fallback - Fallback when no name is available (default "User")
 * @returns Display string for UI
 */
export function getDisplayName(
  user: UserDisplayInput | null | undefined,
  fallback = "User"
): string {
  if (!user) return fallback;
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || (user.username ?? fallback);
}
