import { Icon } from "@/shared/components/icons/Icon";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { SchedulerTask } from "@/shared/types/api";

const TYPE_LABEL: Record<string, string> = { M: "Monthly", D: "Daily", H: "Hourly" };

type Props = { task: SchedulerTask };

export function SchedulerTaskCard({ task }: Props) {
  const on = task.status === "on";
  return (
    <div className="card-surface flex items-center justify-between gap-4 p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            on
              ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}
        >
          <Icon name="clock" className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{task.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {task.schedule_type ? `${TYPE_LABEL[task.schedule_type] ?? task.schedule_type} · ` : ""}
            Next: {task.next_run ? new Date(task.next_run).toLocaleString() : "Not scheduled"}
          </p>
        </div>
      </div>
      <StatusBadge status={task.status} />
    </div>
  );
}
