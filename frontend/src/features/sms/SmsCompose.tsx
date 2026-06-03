import { Alert, Button } from "flowbite-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AudienceFields, type ComposeState } from "@/features/sms/AudienceFields";
import { MessageEditor } from "@/features/sms/MessageEditor";
import { VariableHelper } from "@/features/sms/VariableHelper";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import { apiError } from "@/shared/utils/apiError";
import type { SmsGateway, SmsTemplate } from "@/shared/types/api";

const INIT: ComposeState = { audience: "single", mobile: "", customer_id: "", zone: "" };

export function SmsCompose() {
  const qc = useQueryClient();
  const { data: templates = [] } = usePaginatedList<SmsTemplate>("sms-templates", API.sms.templates);
  const { data: gateways = [] } = usePaginatedList<SmsGateway>("sms-gateways", API.sms.gateways);
  const [s, setS] = useState<ComposeState>(INIT);
  const [message, setMessage] = useState("");
  const update = (patch: Partial<ComposeState>) => setS((p) => ({ ...p, ...patch }));

  const mut = useMutation({
    mutationFn: () => api.post(API.sms.send, {
      audience: s.audience, message, mobile: s.mobile,
      customer_id: s.customer_id, zone: s.zone ? Number(s.zone) : undefined,
    }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sms-logs"] }),
  });

  const noGateway = gateways.length === 0;
  const submit = (e: React.FormEvent) => { e.preventDefault(); mut.mutate(); };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <form onSubmit={submit} className="card-surface space-y-4 p-5 sm:p-6 lg:col-span-2">
        {noGateway ? <Alert color="warning">No SMS gateway configured yet. Add one in the <b>Gateways</b> tab first.</Alert> : null}
        {mut.isSuccess ? <Alert color="success">Done — {mut.data.sent} sent, {mut.data.failed} failed of {mut.data.total}.</Alert> : null}
        {mut.isError ? <Alert color="failure">{apiError(mut.error)}</Alert> : null}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AudienceFields state={s} update={update} />
        </div>
        <MessageEditor message={message} onMessage={setMessage} templates={templates} showVars={false} />
        <div className="flex items-center justify-end gap-3">
          <Button color="primary" type="submit" disabled={mut.isPending || noGateway || !message}>
            {mut.isPending ? "Sending…" : "Send SMS"}
          </Button>
        </div>
      </form>
      <VariableHelper />
    </div>
  );
}
