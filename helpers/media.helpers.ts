const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Resolve media path to full URL.
 * Relative paths (e.g. /media/photos/...) are prefixed with API base URL.
 *
 * @param path - Media path (relative or absolute URL)
 * @param fallback - URL to return when path is empty (e.g. default avatar)
 * @returns Full media URL or fallback
 */
export function getMediaUrl(
  path: string | null | undefined,
  fallback: string
): string {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}
