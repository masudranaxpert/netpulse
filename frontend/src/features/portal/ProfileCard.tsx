import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { money } from "@/shared/utils/format";
import type { PortalProfile } from "@/features/portal/types";

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 text-sm last:border-0 dark:border-slate-800">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-800 dark:text-slate-200">{value ?? "—"}</span>
    </div>
  );
}

export function ProfileCard({ profile }: { profile?: PortalProfile }) {
  if (!profile) return <div className="card-surface h-72 animate-pulse" />;
  return (
    <div className="card-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{profile.customer_name}</h2>
          <p className="text-sm text-slate-400">ID {profile.customer_id}</p>
        </div>
        <StatusBadge status={profile.customer_status} />
      </div>
      <div className="mt-4">
        <Row label="Package" value={profile.package_name} />
        <Row label="Zone" value={profile.zone_name} />
        <Row label="PPPoE" value={profile.pppoe_name} />
        <Row label="Phone" value={profile.phone_number} />
        <Row label="Billing date" value={profile.billing_date ?? undefined} />
        <Row label="Balance" value={money(profile.balance)} />
      </div>
    </div>
  );
}
