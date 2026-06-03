import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { money } from "@/shared/utils/format";

type Props = { collected: number; due: number };

export function CollectionDonut({ collected, due }: Props) {
  const total = collected + due;
  const rate = total > 0 ? Math.round((collected / total) * 100) : 0;
  const data = [
    { name: "Collected", value: collected, color: "#0c8a73" },
    { name: "Outstanding", value: due, color: "#f59e0b" },
  ];

  return (
    <ChartCard title="Collection rate" subtitle="All-time billed amount">
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={84} paddingAngle={3} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{rate}%</span>
          <span className="text-xs text-slate-400">collected</span>
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{money(d.value)}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
