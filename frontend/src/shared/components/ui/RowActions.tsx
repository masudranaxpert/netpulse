import type { ReactNode } from "react";
import { Icon } from "@/shared/components/icons/Icon";
import type { IconName } from "@/shared/components/icons/Icon";

type IconButtonProps = { icon: IconName; label: string; onClick: () => void; tone?: "default" | "danger" };

export function IconButton({ icon, label, onClick, tone = "default" }: IconButtonProps) {
  const color =
    tone === "danger"
      ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
      : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200";
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={`rounded-lg p-2 transition ${color}`}>
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-0.5">{children}</div>;
}
