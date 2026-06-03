import { RoutersManager } from "@/features/routers/RoutersManager";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function RoutersPage() {
  return (
    <>
      <PageHeader title="Routers" description="MikroTik devices and PPPoE management." />
      <RoutersManager />
    </>
  );
}
