import { Select } from "flowbite-react";
import { useState } from "react";
import { smsLogColumns } from "@/features/sms/smsLogColumns";
import { API } from "@/shared/api/endpoints";
import { ResourceList } from "@/shared/components/data/ResourceList";
import type { SmsLog } from "@/shared/types/api";

export function SmsHistory() {
  const [status, setStatus] = useState("");
  return (
    <ResourceList<SmsLog>
      queryKey="sms-logs" url={API.sms.logs} columns={smsLogColumns} rowKey={(r) => r.id}
      searchPlaceholder="Search by number or text…" emptyTitle="No messages yet"
      emptyDescription="Sent and failed SMS will appear here with delivery status." emptyIcon="message"
      params={{ status }}
      filters={
        <Select sizing="sm" value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
          <option value="">All status</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="queued">Queued</option>
        </Select>
      }
    />
  );
}
