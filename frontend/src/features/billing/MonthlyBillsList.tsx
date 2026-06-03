import { Select } from "flowbite-react";
import { useState } from "react";
import { billColumns } from "@/features/billing/billingColumns";
import { API } from "@/shared/api/endpoints";
import { ResourceList } from "@/shared/components/data/ResourceList";
import type { MonthlyBill } from "@/shared/types/api";

const STATUSES = ["unpaid", "partial", "paid", "free"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const now = new Date();
const YEARS = [now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2];

export function MonthlyBillsList() {
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  return (
    <ResourceList<MonthlyBill>
      queryKey="monthly-bills" url={API.billing.monthlyBills} columns={billColumns} rowKey={(r) => r.id}
      searchPlaceholder="Search bills…" emptyTitle="No monthly bills"
      emptyDescription="Generate monthly bills to see them here." emptyIcon="billing"
      params={{ payment_status: status, billing_month: month, billing_year: year }}
      filters={
        <>
          <Select sizing="sm" value={status} onChange={(e) => setStatus(e.target.value)} className="w-32">
            <option value="">All status</option>
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </Select>
          <Select sizing="sm" value={month} onChange={(e) => setMonth(e.target.value)} className="w-32">
            <option value="">All months</option>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </Select>
          <Select sizing="sm" value={year} onChange={(e) => setYear(e.target.value)} className="w-28">
            <option value="">All years</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </>
      }
    />
  );
}
