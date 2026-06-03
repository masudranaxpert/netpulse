import { Button } from "flowbite-react";
import { useState } from "react";
import { SmsTemplateForm } from "@/features/sms/SmsTemplateForm";
import { API } from "@/shared/api/endpoints";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { IconButton, RowActions } from "@/shared/components/ui/RowActions";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { useCrud } from "@/shared/hooks/useCrud";
import { apiError } from "@/shared/utils/apiError";
import type { SmsTemplate } from "@/shared/types/api";

export function SmsTemplates() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SmsTemplate | null>(null);
  const { create, update, remove } = useCrud("sms-templates", API.sms.templates);
  const close = () => setOpen(false);

  const onSubmit = (body: Record<string, unknown>) => {
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: close });
    else create.mutate(body, { onSuccess: close });
  };

  const columns: Column<SmsTemplate>[] = [
    { key: "name", header: "Template", render: (r) => <span className="font-medium text-slate-900 dark:text-white">{r.name}</span> },
    { key: "cat", header: "Category", render: (r) => <StatusBadge status={r.category} /> },
    { key: "body", header: "Message", render: (r) => <span className="line-clamp-2 max-w-md text-sm text-slate-500">{r.body}</span> },
    {
      key: "actions", header: "", align: "right",
      render: (r) => (
        <RowActions>
          <IconButton icon="edit" label="Edit" onClick={() => { setEditing(r); setOpen(true); }} />
          <IconButton icon="trash" label="Delete" tone="danger"
            onClick={() => window.confirm(`Delete template "${r.name}"?`) && remove.mutate(r.id)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <ResourceList<SmsTemplate>
        queryKey="sms-templates" url={API.sms.templates} columns={columns} rowKey={(r) => r.id}
        searchPlaceholder="Search templates…" emptyTitle="No templates yet"
        emptyDescription="Create reusable messages with variables like {name} and {due}." emptyIcon="template"
        toolbarAction={<Button color="primary" onClick={() => { setEditing(null); setOpen(true); }}><Icon name="plus" className="mr-2 h-4 w-4" /> New template</Button>}
      />
      <SmsTemplateForm open={open} onClose={close} initial={editing} onSubmit={onSubmit}
        submitting={create.isPending || update.isPending}
        error={create.isError || update.isError ? apiError(create.error ?? update.error) : null} />
    </>
  );
}
