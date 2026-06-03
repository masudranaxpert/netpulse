import { Select, TextInput } from "flowbite-react";
import { FormField } from "@/shared/components/ui/FormField";
import type { useCustomerForm } from "@/features/customers/useCustomerForm";

type Ctx = ReturnType<typeof useCustomerForm>;

export function ConnectionFields({ f, set, options, profiles, profilesLoading, profilesError }: Ctx) {
  const hasProfiles = profiles.length > 0;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Router">
        <Select value={f.router} onChange={set("router")}>
          <option value="">No router</option>
          {options.routers.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </Select>
      </FormField>
      <FormField label="MikroTik profile">
        {hasProfiles ? (
          <Select value={f.profile_name} onChange={set("profile_name")}>
            <option value="">Select profile</option>
            {profiles.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        ) : (
          <TextInput value={f.profile_name} onChange={set("profile_name")}
            placeholder={profilesLoading ? "Loading profiles…" : "e.g. default"} />
        )}
        {profilesError ? (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Router unreachable — type the profile name manually.
          </p>
        ) : null}
      </FormField>
      <FormField label="PPPoE name" required>
        <TextInput required value={f.pppoe_name} onChange={set("pppoe_name")} />
      </FormField>
      <FormField label="PPPoE password" required>
        <TextInput required value={f.pppoe_pass} onChange={set("pppoe_pass")} />
      </FormField>
      <FormField label="Remote IP">
        <TextInput value={f.remote_ip} onChange={set("remote_ip")} placeholder="Optional static IP" />
      </FormField>
      <FormField label="Service type">
        <Select value={f.service_type} onChange={set("service_type")}>
          <option value="PPPoE">PPPoE</option>
          <option value="Hotspot">Hotspot</option>
          <option value="Static">Static</option>
        </Select>
      </FormField>
    </div>
  );
}
