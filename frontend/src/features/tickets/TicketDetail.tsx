import { Alert, Button, Modal, ModalBody, ModalHeader, Select, Textarea } from "flowbite-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { apiError } from "@/shared/utils/apiError";
import type { Ticket } from "@/shared/types/api";

const STATUS_OPTIONS = ["open", "in_progress", "resolved", "closed"] as const;
const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"] as const;

type Props = { ticketId: number | null; onClose: () => void };

export function TicketDetail({ ticketId, onClose }: Props) {
  const open = ticketId !== null;
  const qc = useQueryClient();
  const [reply, setReply] = useState("");

  const ticketQuery = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => (await api.get<Ticket>(API.ticketDetail(ticketId!))).data,
    enabled: open,
  });

  useEffect(() => {
    if (!open) setReply("");
  }, [open]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
    qc.invalidateQueries({ queryKey: ["tickets"] });
  };

  const patch = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.patch(API.ticketDetail(ticketId!), body),
    onSuccess: invalidate,
  });
  const sendReply = useMutation({
    mutationFn: (text: string) => api.post(API.ticketReply(ticketId!), { reply_text: text }),
    onSuccess: () => { setReply(""); invalidate(); },
  });

  const t = ticketQuery.data;

  return (
    <Modal show={open} onClose={onClose} size="xl" dismissible>
      <ModalHeader>{t ? `Ticket #${t.id} — ${t.title}` : "Ticket"}</ModalHeader>
      <ModalBody className="max-h-[70vh] overflow-y-auto">
        {ticketQuery.isError ? (
          <Alert color="failure">Could not load this ticket.</Alert>
        ) : !t ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={t.status} onChange={(e) => patch.mutate({ status: e.target.value })} className="w-40">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </Select>
              <Select value={t.priority} onChange={(e) => patch.mutate({ priority: e.target.value })} className="w-36">
                {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
              <span className="text-sm text-slate-400">{t.customer_name} · {t.customer_id}</span>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-ink-800 dark:text-slate-300">
              {t.description}
            </div>

            <div className="space-y-3">
              {(t.replies ?? []).map((r) => (
                <div key={r.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <StatusBadge status={r.author_type} />
                    <span>{r.author_name}</span>
                    <span>{r.created_at ? new Date(r.created_at).toLocaleString() : ""}</span>
                  </div>
                  <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-ink-800 dark:text-slate-200">{r.reply_text}</p>
                </div>
              ))}
              {(t.replies ?? []).length === 0 ? (
                <p className="text-sm text-slate-400">No replies yet.</p>
              ) : null}
            </div>

            {sendReply.isError ? <Alert color="failure">{apiError(sendReply.error)}</Alert> : null}
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => { e.preventDefault(); if (reply.trim()) sendReply.mutate(reply.trim()); }}
            >
              <div className="flex-1">
                <Textarea rows={2} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply as support staff…" />
              </div>
              <Button type="submit" color="primary" disabled={sendReply.isPending || !reply.trim()}>
                Reply
              </Button>
            </form>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
