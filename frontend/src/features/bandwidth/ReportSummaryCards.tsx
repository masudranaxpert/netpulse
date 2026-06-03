import { Icon } from "@/shared/components/icons/Icon";
import { bytes } from "@/shared/utils/format";
import type { ConsumptionSummary, ConsumptionWindow } from "./types";

function SummaryCard({ label, win }: { label: string; win: ConsumptionWindow }) {
  return (
    <div className="card-surface p-5">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {bytes(win.total_bytes)}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
            <Icon name="download" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Download</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{bytes(win.download_bytes)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">
            <Icon name="upload" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Upload</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{bytes(win.upload_bytes)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReportSummaryCards({ summary }: { summary?: ConsumptionSummary }) {
  const empty = { upload_bytes: 0, download_bytes: 0, total_bytes: 0 };
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard label="Today's Consumption" win={summary?.today ?? empty} />
      <SummaryCard label="Last 7 Days" win={summary?.last_7_days ?? empty} />
      <SummaryCard label="Last 30 Days" win={summary?.last_30_days ?? empty} />
    </div>
  );
}
