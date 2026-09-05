import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Icon } from "@/shared/components/icons/Icon";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import type { OltDevice } from "@/shared/types/api";

const OLT_TYPES: [string, string][] = [
  ["BDCOM_EPON", "BDCOM EPON"], ["BDCOM_GPON", "BDCOM GPON"],
  ["VSOL_EPON", "VSOL EPON"], ["VSOL_EPON_TYPE_2", "VSOL EPON (Type 2)"], ["VSOL_GPON", "VSOL GPON"],
  ["CDATA_EPON", "C-Data EPON"], ["CDATA_GPON", "C-Data GPON"],
  ["PHOTON_EPON", "Photon EPON"],
  ["HUAWEI_GPON", "Huawei GPON"],
  ["ZTE_EPON", "ZTE EPON"], ["ZTE_GPON", "ZTE GPON"],
  ["CORELINK_EPON", "CoreLink EPON"], ["AVEIS_EPON", "AVEIS EPON"],
  ["GENERIC_EPON", "Generic EPON"], ["GENERIC_GPON", "Generic GPON"],
];

const EMPTY = {
  name: "", host: "", telnet_port: "23", web_port: "80", protocol: "http",
  olt_type: "BDCOM_EPON", telnet_username: "admin", telnet_password: "",
  snmp_community: "public", snmp_port: "161", timeout: "10",
};

type Props = {
  open: boolean; onClose: () => void; initial?: OltDevice | null;
  onSubmit: (body: Record<string, unknown>) => void; submitting?: boolean; error?: string | null;
};

export function OltDeviceForm({ open, onClose, initial, onSubmit, submitting, error }: Props) {
  const [f, setF] = useState({ ...EMPTY });
  const [showPass, setShowPass] = useState(false);
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (!open) return;
    setShowPass(false);
    setF(initial ? {
      name: initial.name ?? "", host: initial.host ?? "",
      telnet_port: String(initial.telnet_port ?? 23), web_port: String(initial.web_port ?? 80),
      protocol: initial.protocol ?? "http", olt_type: initial.olt_type ?? "BDCOM_EPON",
      telnet_username: initial.telnet_username ?? "", telnet_password: initial.telnet_password ?? "",
      snmp_community: initial.snmp_community ?? "public", snmp_port: String(initial.snmp_port ?? 161),
      timeout: String(initial.timeout ?? 10),
    } : { ...EMPTY });
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: f.name.trim(), host: f.host.trim(),
      telnet_port: Number(f.telnet_port) || 23, web_port: Number(f.web_port) || 80,
      protocol: f.protocol, olt_type: f.olt_type,
      telnet_username: f.telnet_username, telnet_password: f.telnet_password,
      snmp_community: f.snmp_community, snmp_port: Number(f.snmp_port) || 161, timeout: Number(f.timeout) || 10,
    });
  };

  return (
    <FormModal open={open} onClose={onClose} title={initial ? "Edit OLT" : "Register New OLT"}
      onSubmit={submit} submitting={submitting} error={error}
      submitLabel={initial ? "Save" : "Add OLT"} cancelLabel="Close">
      <FormField label="OLT Name" required full>
        <TextInput required value={f.name} onChange={set("name")} placeholder="e.g. Core OLT 1" />
      </FormField>
      <FormField label="IP Address" required>
        <TextInput required value={f.host} onChange={set("host")} placeholder="e.g. 192.168.1.100" />
      </FormField>
      <FormField label="Telnet Port">
        <TextInput type="number" value={f.telnet_port} onChange={set("telnet_port")} placeholder="23" />
      </FormField>
      <FormField label="Web Port">
        <TextInput type="number" value={f.web_port} onChange={set("web_port")} placeholder="80" />
      </FormField>
      <FormField label="Protocol">
        <Select value={f.protocol} onChange={set("protocol")}>
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </Select>
      </FormField>
      <FormField label="OLT Brand & Technology Type" required full>
        <Select required value={f.olt_type} onChange={set("olt_type")}>
          {OLT_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
      </FormField>

      <div className="mt-2 border-t border-slate-200 pt-3 sm:col-span-2 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Access Credentials</h3>
      </div>
      <FormField label="Telnet User">
        <TextInput value={f.telnet_username} onChange={set("telnet_username")} placeholder="admin" />
      </FormField>
      <FormField label="Telnet Password">
        <TextInput type={showPass ? "text" : "password"} value={f.telnet_password} onChange={set("telnet_password")}
          placeholder="password"
          rightIcon={() => (
            <button type="button" onClick={() => setShowPass((s) => !s)} className="pointer-events-auto text-slate-400 hover:text-slate-600">
              <Icon name={showPass ? "eyeOff" : "eye"} className="h-4 w-4" />
            </button>
          )} />
      </FormField>
      <FormField label="SNMP Read Community">
        <TextInput value={f.snmp_community} onChange={set("snmp_community")} placeholder="public" />
      </FormField>
      <FormField label="SNMP Port">
        <TextInput type="number" value={f.snmp_port} onChange={set("snmp_port")} placeholder="161" />
      </FormField>
      <FormField label="Timeout (s)">
        <TextInput type="number" value={f.timeout} onChange={set("timeout")} placeholder="10" />
      </FormField>
    </FormModal>
  );
}
