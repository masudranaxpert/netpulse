import { useSearchParams } from "react-router-dom";
import { CategoryBanner } from "@/features/customers/CategoryBanner";
import type { ClientCategory } from "@/features/customers/CategoryBanner";
import { CustomersManager } from "@/features/customers/CustomersManager";

const VALID: readonly ClientCategory[] = [
  "all", "active", "due", "free", "inactive", "expired", "left", "online",
];

function resolve(filter: string | null): ClientCategory {
  return (VALID as readonly string[]).includes(filter ?? "") ? (filter as ClientCategory) : "all";
}

export function CustomersPage() {
  const [params] = useSearchParams();
  const category = resolve(params.get("filter"));
  return (
    <>
      <CategoryBanner category={category} />
      <CustomersManager />
    </>
  );
}
