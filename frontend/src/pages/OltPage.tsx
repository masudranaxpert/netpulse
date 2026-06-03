import { useState } from "react";
import { OltDevicesManager } from "@/features/olt/OltDevicesManager";
import { OnusManager } from "@/features/olt/OnusManager";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import type { OltDevice } from "@/shared/types/api";

const TABS = [
  { id: "olt", label: "OLT devices" },
  { id: "onu", label: "ONUs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function OltPage() {
  const [tab, setTab] = useState<TabId>("olt");
  const [onuOlt, setOnuOlt] = useState("");

  const viewOnus = (olt: OltDevice) => { setOnuOlt(String(olt.id)); setTab("onu"); };

  return (
    <>
      <PageHeader title="OLT / ONU" description="Manage your GPON/EPON OLTs, sync ONUs over SNMP and monitor optical signal." />
      <div className="mb-4 flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "border-brand-600 text-brand-700 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "olt" ? (
        <OltDevicesManager onViewOnus={viewOnus} />
      ) : (
        <OnusManager oltId={onuOlt} onOltId={setOnuOlt} />
      )}
    </>
  );
}
