import { Icon } from "@/shared/components/icons/Icon";
import type { IconName } from "@/shared/components/icons/Icon";
import type { OltDevice } from "@/shared/types/api";

type Props = {
  device: OltDevice;
  onEdit: () => void;
  onTest: () => void;
  onViewOnus: () => void;
  onDelete: () => void;
  testing?: boolean;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}:</span>
      <span className="font-medium text-slate-800 dark:text-slate-100">{value}</span>
    </div>
  );
}

function CardButton({ icon, label, onClick, tone = "default", disabled }: {
  icon: IconName; label: string; onClick: () => void; tone?: "default" | "danger"; disabled?: boolean;
}) {
  const styles = tone === "danger"
    ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900/30"
    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-50 ${styles}`}>
      <Icon name={icon} className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export function OltCard({ device, onEdit, onTest, onViewOnus, onDelete, testing }: Props) {
  const online = device.status === "online";
  const brand = (device.olt_type ?? "").replace(/_/g, " ");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-white">{device.name || device.host}</p>
          <span className="mt-1 inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
            {brand}
          </span>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          online
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`} />
          {online ? "Online" : "Offline"}
        </span>
      </div>

      <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
        <Row label="IP Address" value={device.host} />
        <Row label="Web Port" value={`${device.web_port} (${(device.protocol ?? "http").toUpperCase()})`} />
        <Row label="Telnet Port" value={String(device.telnet_port)} />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <CardButton icon="edit" label="Edit" onClick={onEdit} />
        <CardButton icon="wifi" label="Test" onClick={onTest} disabled={testing} />
        <CardButton icon="users" label="ONUs" onClick={onViewOnus} />
        <CardButton icon="trash" label="Delete" tone="danger" onClick={onDelete} />
      </div>
    </div>
  );
}
