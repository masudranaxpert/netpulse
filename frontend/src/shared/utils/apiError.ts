export function apiError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === "string") return d.detail;
    if (typeof d.message === "string") return d.message;
    const parts: string[] = [];
    for (const [key, value] of Object.entries(d)) {
      const text = Array.isArray(value) ? value.join(" ") : String(value);
      parts.push(`${key}: ${text}`);
    }
    if (parts.length) return parts.join(" • ");
  }
  return fallback;
}
