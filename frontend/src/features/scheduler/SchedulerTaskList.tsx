import { SchedulerTaskCard } from "@/features/scheduler/SchedulerTaskCard";
import { useSchedulerTasks } from "@/features/scheduler/useSchedulerTasks";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { TableSkeleton } from "@/shared/components/ui/TableSkeleton";

export function SchedulerTaskList() {
  const { data, isLoading, isError } = useSchedulerTasks();

  if (isLoading) return <TableSkeleton rows={3} />;
  if (isError) return <ErrorAlert message="Could not load scheduler tasks." />;

  const tasks = data ?? [];
  if (tasks.length === 0)
    return (
      <EmptyState
        title="No scheduled tasks"
        description="Automated billing and maintenance jobs will appear here."
        icon="clock"
      />
    );

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <SchedulerTaskCard key={task.task_id} task={task} />
      ))}
    </div>
  );
}
