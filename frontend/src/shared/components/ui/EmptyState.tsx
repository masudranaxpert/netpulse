import { Button } from "flowbite-react";
import { Icon, type IconName } from "@/shared/components/icons/Icon";

type Props = {
  title: string;
  description: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, icon = "inbox", actionLabel, onAction }: Props) {
  return (
    <div className="card-surface flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        <Icon name={icon} className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction ? (
        <Button color="primary" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
