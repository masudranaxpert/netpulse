import { Spinner } from "flowbite-react";

type Props = { label?: string };

export function LoadingState({ label = "Loading…" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24" role="status">
      <Spinner size="xl" color="success" />
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}
