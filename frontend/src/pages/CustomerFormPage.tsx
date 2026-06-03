import { Alert, Button } from "flowbite-react";
import type { ReactNode } from "react";
import { ConnectionFields } from "@/features/customers/ConnectionFields";
import { CustomerDetailsFields } from "@/features/customers/CustomerDetailsFields";
import { useCustomerForm } from "@/features/customers/useCustomerForm";
import { Icon } from "@/shared/components/icons/Icon";
import { PageHeader } from "@/shared/components/layout/PageHeader";

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      </div>
      {children}
    </section>
  );
}

export function CustomerFormPage() {
  const ctx = useCustomerForm();
  return (
    <>
      <PageHeader
        title={ctx.isEdit ? "Edit customer" : "New customer"}
        description={ctx.isEdit ? "Update profile, zone and package." : "Create a customer and provision their connection."}
        actions={
          <Button color="light" onClick={ctx.cancel}>
            <Icon name="arrowLeft" className="mr-2 h-4 w-4" /> Back
          </Button>
        }
      />
      <form onSubmit={ctx.submit} className="mx-auto max-w-3xl space-y-5">
        {ctx.error ? <Alert color="failure">{ctx.error}</Alert> : null}
        <Section title="Customer information" hint="Identity, contact and billing details.">
          <CustomerDetailsFields {...ctx} />
        </Section>
        {!ctx.isEdit ? (
          <Section title="Connection (PPPoE)" hint="Link to a MikroTik router and select a profile.">
            <ConnectionFields {...ctx} />
          </Section>
        ) : null}
        <div className="flex items-center justify-end gap-3 pb-2">
          <Button color="light" type="button" onClick={ctx.cancel} disabled={ctx.submitting}>Cancel</Button>
          <Button color="primary" type="submit" disabled={ctx.submitting}>
            {ctx.submitting ? "Saving…" : ctx.isEdit ? "Save changes" : "Create customer"}
          </Button>
        </div>
      </form>
    </>
  );
}
