import { Alert, Button, Select, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerSearchSelect } from "@/features/payments/CustomerSearchSelect";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { FormField } from "@/shared/components/ui/FormField";
import { apiError } from "@/shared/utils/apiError";

const METHODS: [string, string][] = [
  ["cash", "Cash"], ["bkash", "bKash"], ["nagad", "Nagad"], ["rocket", "Rocket"],
  ["bank_transfer", "Bank transfer"], ["card", "Card"], ["adjustment", "Adjustment"], ["other", "Other"],
];

export function PaymentForm({ initialCustomer = "" }: { initialCustomer?: string }) {
  const qc = useQueryClient();
  const [f, setF] = useState({ customer_id: initialCustomer, amount: "", payment_method: "cash", transaction_id: "", notes: "" });
  const [ok, setOk] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const mut = useMutation({
    mutationFn: (body: unknown) => api.post(API.billing.addTransaction, body).then((r) => r.data),
    onSuccess: () => {
      ["transactions", "monthly-bills", "connection-fees", "dashboard-summary", "customers", "customer-detail"]
        .forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      setOk(`Payment of ৳${Math.abs(Number(f.amount))} recorded and allocated.`);
      setF((p) => ({ ...p, amount: "", transaction_id: "", notes: "" }));
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    mut.mutate({
      customer_id: f.customer_id, amount: Number(f.amount), payment_method: f.payment_method,
      transaction_id: f.transaction_id || null, notes: f.notes || null,
    });
  };

  return (
    <form onSubmit={submit} className="card-surface space-y-4 p-5 sm:p-6">
      {ok ? <Alert color="success">{ok}</Alert> : null}
      {mut.isError ? <Alert color="failure">{apiError(mut.error)}</Alert> : null}
      <FormField label="Customer" required>
        <CustomerSearchSelect value={f.customer_id} onChange={(id) => setF((p) => ({ ...p, customer_id: id }))} />
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Amount (৳)" required>
          <TextInput type="number" step="0.01" required value={f.amount} onChange={set("amount")}
            placeholder="e.g. 500  •  use -200 for a deduction" />
        </FormField>
        <FormField label="Received via">
          <Select value={f.payment_method} onChange={set("payment_method")}>
            {METHODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </Select>
        </FormField>
      </div>
      <FormField label="Reference / Trx ID">
        <TextInput value={f.transaction_id} onChange={set("transaction_id")} placeholder="bKash/bank reference (optional)" />
      </FormField>
      <FormField label="Notes">
        <Textarea rows={2} value={f.notes} onChange={set("notes")} />
      </FormField>
      <div className="flex justify-end">
        <Button color="primary" type="submit" disabled={mut.isPending || !f.customer_id}>
          {mut.isPending ? "Recording…" : "Record payment"}
        </Button>
      </div>
    </form>
  );
}
