import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { LiveUsage } from "./types";

export type ThroughputPoint = { t: number; down: number; up: number };

const MAX_POINTS = 12; // ~2 minutes at a 10s cadence
const POLL_MS = 10000;

/**
 * Polls the live endpoint every ~10s and derives aggregate download/upload
 * throughput (bits/sec) from cumulative byte-counter deltas, keeping a rolling
 * window of recent samples for the real-time chart.
 */
export function useLiveBandwidth(routerId: string, enabled = true) {
  const [points, setPoints] = useState<ThroughputPoint[]>([]);
  const [speed, setSpeed] = useState({ down: 0, up: 0 });
  const prev = useRef<{ ts: number; down: number; up: number } | null>(null);

  const query = useQuery({
    queryKey: ["bandwidth-live", routerId],
    queryFn: async () => {
      const params = routerId ? { router: routerId } : {};
      return (await api.get<LiveUsage>(API.bandwidth.live, { params })).data;
    },
    refetchInterval: enabled ? POLL_MS : false,
    enabled,
    retry: false,
  });

  useEffect(() => {
    prev.current = null;
    setPoints([]);
    setSpeed({ down: 0, up: 0 });
  }, [routerId]);

  const data = query.data;
  useEffect(() => {
    if (!data) return;
    const now = data.timestamp || Date.now();
    const dl = data.total_download_bytes;
    const ul = data.total_upload_bytes;
    if (prev.current) {
      const dt = (now - prev.current.ts) / 1000;
      if (dt > 0.5) {
        // Counters reset on session reconnects, so clamp negative deltas to 0.
        const down = Math.max(0, ((dl - prev.current.down) * 8) / dt);
        const up = Math.max(0, ((ul - prev.current.up) * 8) / dt);
        setSpeed({ down, up });
        setPoints((p) => [...p, { t: now, down, up }].slice(-MAX_POINTS));
      }
    }
    prev.current = { ts: now, down: dl, up: ul };
  }, [data]);

  return { data, speed, points, query };
}
