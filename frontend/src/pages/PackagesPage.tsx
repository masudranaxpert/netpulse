import { PackagesManager } from "@/features/packages/PackagesManager";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function PackagesPage() {
  return (
    <>
      <PageHeader title="Packages" description="Internet plans, speeds, and pricing." />
      <PackagesManager />
    </>
  );
}
