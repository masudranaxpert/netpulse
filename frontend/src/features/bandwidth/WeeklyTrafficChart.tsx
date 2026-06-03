import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { bytes } from "@/shared/utils/format";
import type { WeeklyPoint } from "./types";

export function WeeklyTrafficChart({ data }: { data: WeeklyPoint[] }) {
  const hasData = data.some((d) => d.download_bytes > 0 || d.upload_bytes > 0);

  return (
    <ChartCard title="Weekly Traffic Consumption" subtitle="Download vs upload per day (last 7 days)">
      <div className="h-72">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => bytes(Number(v))} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
              <Tooltip
                cursor={{ fill: "#94a3b820" }}
                formatter={(v, n) => [bytes(Number(v)), n === "download_bytes" ? "Download" : "Upload"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === "download_bytes" ? "Download" : "Upload")} />
              <Bar dataKey="download_bytes" name="download_bytes" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="upload_bytes" name="upload_bytes" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
            No recorded usage yet. Run “Sync Bandwidth” to capture snapshots.
          </div>
        )}
      </div>
    </ChartCard>
  );
}
