export function money(value: number | string): string {
  return `৳${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
}

export function compact(value: number | string): string {
  const n = Number(value) || 0;
  if (n >= 1000) return `৳${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `৳${n}`;
}

export function bytes(value?: number | string): string {
  let n = Number(value) || 0;
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function bitrate(bitsPerSec: number): string {
  let n = Math.max(0, bitsPerSec);
  const units = ["bps", "Kbps", "Mbps", "Gbps"];
  let i = 0;
  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i += 1;
  }
  return `${n.toFixed(i >= 2 ? 2 : 0)} ${units[i]}`;
}
