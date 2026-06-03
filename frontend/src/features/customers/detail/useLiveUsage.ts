import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { LiveStats } from "@/shared/types/api";

export type SpeedPoint = { t: number; down: number; up: number };

const MAX_POINTS = 30;
const POLL_MS = 2500;

/** Polls live stats and derives download/upload speed (bits/sec) from byte deltas. */
export function useLiveUsage(customerId: string, enabled: boolean) {
  const [points, setPoints] = useState<SpeedPoint[]>([]);
  const [speed, setSpeed] = useState({ down: 0, up: 0 });
  const prev = useRef<{ ts: number; inB: number; outB: number } | null>(null);

  const q = useQuery({
    queryKey: ["customer-live-usage", customerId],
    queryFn: async () => (await api.get<LiveStats>(API.customerLiveStats(customerId))).data,
    refetchInterval: enabled ? POLL_MS : false,
    enabled,
    retry: false,
  });

  const data = q.data;
  useEffect(() => {
    if (!enabled) {
      prev.current = null;
      return;
    }
    if (!data?.live_stats_available) {
      prev.current = null;
      setSpeed({ down: 0, up: 0 });
      return;
    }
    const now = Date.now();
    const outB = Number(data.bytes_out) || 0; // download to customer
    const inB = Number(data.bytes_in) || 0; // upload from customer
    if (prev.current) {
      const dt = (now - prev.current.ts) / 1000;
      if (dt > 0.4) {
        const down = Math.max(0, ((outB - prev.current.outB) * 8) / dt);
        const up = Math.max(0, ((inB - prev.current.inB) * 8) / dt);
        setSpeed({ down, up });
        setPoints((p) => [...p, { t: now, down, up }].slice(-MAX_POINTS));
      }
    }
    prev.current = { ts: now, inB, outB };
  }, [data, enabled]);

  return { data, speed, points, isFetching: q.isFetching, refetch: q.refetch };
}
