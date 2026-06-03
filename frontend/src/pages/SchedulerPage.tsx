import { SchedulerTaskList } from "@/features/scheduler/SchedulerTaskList";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function SchedulerPage() {
  return (
    <>
      <PageHeader title="Scheduler" description="Automated billing and network maintenance jobs." />
      <SchedulerTaskList />
    </>
  );
}
