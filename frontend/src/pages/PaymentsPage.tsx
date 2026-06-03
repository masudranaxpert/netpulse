import { useSearchParams } from "react-router-dom";
import { PaymentForm } from "@/features/payments/PaymentForm";
import { PaymentsHistory } from "@/features/payments/PaymentsHistory";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function PaymentsPage() {
  const [params] = useSearchParams();
  const initialCustomer = params.get("customer") ?? "";
  return (
    <>
      <PageHeader title="Payments" description="Search a customer, enter the amount they paid, and the bills settle automatically." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PaymentForm key={initialCustomer} initialCustomer={initialCustomer} />
        </div>
        <div className="lg:col-span-3">
          <PaymentsHistory />
        </div>
      </div>
    </>
  );
}
