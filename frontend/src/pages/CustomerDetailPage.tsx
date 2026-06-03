import { useParams } from "react-router-dom";
import { BillingPanel } from "@/features/customers/detail/BillingPanel";
import { CustomerInvoices } from "@/features/customers/detail/CustomerInvoices";
import { DetailHeader } from "@/features/customers/detail/DetailHeader";
import { LiveStatusCard } from "@/features/customers/detail/LiveStatusCard";
import { ProfileCards } from "@/features/customers/detail/ProfileCards";
import { useCustomerDetail } from "@/features/customers/detail/useCustomerDetail";

export function CustomerDetailPage() {
  const { customerId } = useParams();
  const { data, isLoading, isError } = useCustomerDetail(customerId);

  if (isLoading) return <p className="py-12 text-center text-slate-400">Loading customer…</p>;
  if (isError || !data) return <p className="py-12 text-center text-rose-500">Customer not found.</p>;

  return (
    <>
      <DetailHeader customer={data} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <ProfileCards customer={data} />
          <CustomerInvoices customerId={data.customer_id} />
        </div>
        <div className="space-y-5">
          <BillingPanel customer={data} />
          <LiveStatusCard customerId={data.customer_id} />
        </div>
      </div>
    </>
  );
}
