import { ZonesManager } from "@/features/zones/ZonesManager";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function ZonesPage() {
  return (
    <>
      <PageHeader title="Zones" description="Geographic areas for customer addressing." />
      <ZonesManager />
    </>
  );
}
