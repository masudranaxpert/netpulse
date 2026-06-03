import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { bitrate } from "@/shared/utils/format";
import type { ThroughputPoint } from "./useLiveBandwidth";

export function ThroughputChart({ points }: { points: ThroughputPoint[] }) {
  const data = points.map((p) => ({
    time: new Date(p.t).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
    down: p.down,
    up: p.up,
  }));

  return (
    <ChartCard title="Real-time Network Throughput" subtitle="Last 2 minutes · refreshes every 10s">
      <div className="h-72">
        {data.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="tpDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="tpUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => bitrate(Number(v))} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip
                formatter={(v, n) => [bitrate(Number(v)), n === "down" ? "Download" : "Upload"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === "down" ? "Download" : "Upload")} />
              <Area type="monotone" dataKey="down" stroke="#0ea5e9" strokeWidth={2} fill="url(#tpDown)" isAnimationActive={false} />
              <Area type="monotone" dataKey="up" stroke="#8b5cf6" strokeWidth={2} fill="url(#tpUp)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Measuring live throughput…
          </div>
        )}
      </div>
    </ChartCard>
  );
}
