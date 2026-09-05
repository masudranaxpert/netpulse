import { Icon } from "@/shared/components/icons/Icon";

type Props = { compact?: boolean; /** Force light text — for surfaces that are always dark (landing, auth hero). */ onDark?: boolean };

export function Brand({ compact, onDark }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30">
        <Icon name="wifi" className="h-5 w-5" />
      </div>
      {!compact ? (
        <div className="leading-tight">
          <p className={`text-base font-bold tracking-tight ${onDark ? "text-white" : "text-slate-900 dark:text-white"}`}>
            NetPulse
          </p>
          <p className="text-[11px] font-medium text-slate-400">ISP Control Center</p>
        </div>
      ) : null}
    </div>
  );
}
