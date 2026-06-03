import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { useCreateTicket } from "@/features/portal/portalData";

export function TicketComposer() {
  const create = useCreateTicket();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(
      { title, description, priority },
      { onSuccess: () => { setTitle(""); setDescription(""); setPriority("medium"); } },
    );
  };

  return (
    <form onSubmit={submit} className="card-surface space-y-4 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white">Open a new ticket</h3>
      <div>
        <Label htmlFor="t-title" className="mb-1.5 block">Subject</Label>
        <TextInput id="t-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Slow internet speed" />
      </div>
      <div>
        <Label htmlFor="t-desc" className="mb-1.5 block">Describe the issue</Label>
        <Textarea id="t-desc" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="t-prio" className="mb-1.5 block">Priority</Label>
        <Select id="t-prio" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
      </div>
      <Button type="submit" color="primary" disabled={create.isPending}>
        {create.isPending ? "Submitting…" : "Submit ticket"}
      </Button>
    </form>
  );
}
