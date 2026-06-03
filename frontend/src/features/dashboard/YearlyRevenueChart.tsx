import {
  Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { compact, money } from "@/shared/utils/format";

type Row = { year: string; billed: number; collected: number };

export function YearlyRevenueChart({ data }: { data: Row[] }) {
  const rows = data.map((d) => ({
    ...d,
    rate: d.billed > 0 ? Math.round((d.collected / d.billed) * 100) : 0,
  }));

  return (
    <ChartCard title="Yearly review" subtitle="Billed, collected & collection rate by year">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="gBill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.25} />
              </linearGradient>
              <linearGradient id="gColl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c8a73" stopOpacity={1} />
                <stop offset="100%" stopColor="#14a085" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="amt" tickFormatter={compact} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rate" orientation="right" unit="%" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v, n) => (n === "Collection rate" ? `${v}%` : money(Number(v)))}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="amt" dataKey="billed" name="Billed" fill="url(#gBill)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            <Bar yAxisId="amt" dataKey="collected" name="Collected" fill="url(#gColl)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            <Line yAxisId="rate" type="monotone" dataKey="rate" name="Collection rate" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
