/** API base URL — uses VITE_API_URL in production, empty string for local (Vite proxy handles it) */
export const API_BASE = import.meta.env.VITE_API_URL || '';

/** Build a full API URL from a relative path like '/api/games' */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
