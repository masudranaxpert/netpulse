import { Button } from "flowbite-react";
import { useState } from "react";
import { ConnectionEditModal } from "@/features/customers/detail/ConnectionEditModal";
import { DetailCard, InfoRow } from "@/features/customers/detail/InfoRow";
import { Icon } from "@/shared/components/icons/Icon";
import { SecretText } from "@/shared/components/ui/SecretText";
import type { CustomerDetail } from "@/shared/types/api";

export function ProfileCards({ customer }: { customer: CustomerDetail }) {
  const r = customer.router_info;
  const [editing, setEditing] = useState(false);
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <DetailCard title="Profile">
        <InfoRow label="Phone">{customer.phone_number}</InfoRow>
        <InfoRow label="Alt. phone">{customer.phone_number2 || "—"}</InfoRow>
        <InfoRow label="NID">{customer.nid || "—"}</InfoRow>
        <InfoRow label="Zone">{customer.zone_name || "—"}</InfoRow>
        <InfoRow label="Package">{customer.package_name || "—"}</InfoRow>
        <InfoRow label="Address">{customer.address}</InfoRow>
      </DetailCard>
      <DetailCard title="Connection (PPPoE)"
        action={r ? (
          <Button size="xs" color="light" onClick={() => setEditing(true)}>
            <Icon name="edit" className="mr-1 h-3.5 w-3.5" /> Edit
          </Button>
        ) : undefined}>
        {r ? (
          <>
            <InfoRow label="Router">{r.router_name || "—"}</InfoRow>
            <InfoRow label="MikroTik profile">{r.profile_name ? <span className="font-mono">{r.profile_name}</span> : "—"}</InfoRow>
            <InfoRow label="PPPoE name"><span className="font-mono">{r.pppoe_name}</span></InfoRow>
            <InfoRow label="PPPoE password"><SecretText value={r.pppoe_pass} /></InfoRow>
            <InfoRow label="Remote IP">{r.remote_ip || "—"}</InfoRow>
          </>
        ) : (
          <p className="py-6 text-center text-sm text-slate-400">No PPPoE / router linked.</p>
        )}
      </DetailCard>
      {r ? <ConnectionEditModal open={editing} onClose={() => setEditing(false)} customer={customer} /> : null}
    </div>
  );
}
