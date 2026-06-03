import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { bitrate } from "@/shared/utils/format";
import type { SpeedPoint } from "./useLiveUsage";

export function LiveUsageChart({ points }: { points: SpeedPoint[] }) {
  const data = points.map((p, i) => ({ i, down: p.down, up: p.up }));
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="spDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="spUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <YAxis tickFormatter={(v) => bitrate(Number(v))} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
          <Tooltip
            formatter={(v, n) => [bitrate(Number(v)), n === "down" ? "Download" : "Upload"]}
            labelFormatter={() => ""}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="down" stroke="#10b981" strokeWidth={2} fill="url(#spDown)" isAnimationActive={false} />
          <Area type="monotone" dataKey="up" stroke="#0ea5e9" strokeWidth={2} fill="url(#spUp)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
