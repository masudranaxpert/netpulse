import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useReplyTicket, useTicketDetail } from "@/features/portal/portalData";

export function TicketThread({ id }: { id: number }) {
  const { data, isLoading } = useTicketDetail(id);
  const reply = useReplyTicket(id);
  const [text, setText] = useState("");

  if (isLoading) return <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-ink-800" />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    reply.mutate(text, { onSuccess: () => setText("") });
  };

  return (
    <div className="mt-3 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
      {data?.replies?.length ? (
        data.replies.map((r) => (
          <div
            key={r.id}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              r.admin_user
                ? "bg-brand-50 text-brand-900 dark:bg-brand-900/30 dark:text-brand-100"
                : "ml-auto bg-slate-100 text-slate-700 dark:bg-ink-800 dark:text-slate-200"
            }`}
          >
            <p className="text-[11px] font-semibold opacity-60">{r.admin_user ? "Support" : "You"}</p>
            {r.reply_text}
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400">No replies yet.</p>
      )}
      <form onSubmit={submit} className="flex items-end gap-2">
        <Textarea required rows={1} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply…" className="flex-1" />
        <Button type="submit" color="primary" size="sm" disabled={reply.isPending}>Send</Button>
      </form>
    </div>
  );
}
