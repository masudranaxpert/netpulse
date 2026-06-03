import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { compact, money } from "@/shared/utils/format";

type Row = { month: string; collected: number; due: number };

export function MonthlyBillingChart({ data }: { data: Row[] }) {
  return (
    <ChartCard
      title="Monthly billing"
      subtitle={`Collected vs outstanding · ${new Date().getFullYear()}`}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={compact} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "#94a3b820" }}
              formatter={(v) => money(Number(v))}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="collected" name="Collected" fill="#0c8a73" radius={[4, 4, 0, 0]} maxBarSize={22} />
            <Bar dataKey="due" name="Outstanding" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
