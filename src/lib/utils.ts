/**
 * Parses JSON safely. Returns `fallback` when parsing fails or input is empty.
 * Use this for any localStorage/sessionStorage read that could otherwise crash.
 */
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
