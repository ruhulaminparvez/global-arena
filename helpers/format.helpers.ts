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
