import { Alert, Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitting?: boolean;
  error?: string | null;
  submitLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
};

export function FormModal({ open, onClose, title, onSubmit, submitting, error, submitLabel = "Save", cancelLabel = "Cancel", children }: Props) {
  return (
    <Modal show={open} onClose={onClose} size="lg">
      <ModalHeader>{title}</ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalBody>
          {error ? (
            <Alert color="failure" className="mb-4">{error}</Alert>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
        </ModalBody>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-4 dark:border-slate-700">
          <Button color="light" type="button" onClick={onClose} disabled={submitting}>{cancelLabel}</Button>
          <Button color="primary" type="submit" disabled={submitting}>
            {submitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
