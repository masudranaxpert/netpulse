import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/shared/components/icons/Icon";
import type { IconName } from "@/shared/components/icons/Icon";

export type Action = {
  icon: IconName;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger" | "warning";
  hidden?: boolean;
};

type Props = {
  actions: Action[];
  /** Optional custom trigger; defaults to a gear icon button. */
  trigger?: ReactNode;
  /** Align dropdown to the start (left) of the trigger instead of the end (right). */
  align?: "start" | "end";
};

const TONE: Record<string, string> = {
  default: "text-slate-600 dark:text-slate-300",
  danger: "text-rose-600 dark:text-rose-400",
  warning: "text-amber-600 dark:text-amber-400",
};

export function ActionMenu({ actions, trigger, align = "end" }: Props) {
  const items = actions.filter((a) => !a.hidden);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 6, left: align === "end" ? r.right : r.left });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="Actions"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={
          trigger
            ? "inline-flex items-center"
            : "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        }
      >
        {trigger ?? <Icon name="settings" className="h-4 w-4" />}
      </button>
      {open
        ? createPortal(
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
              <div
                style={{ top: pos.top, left: pos.left }}
                className={`fixed z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-ink-800 ${
                  align === "end" ? "-translate-x-full" : ""
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {items.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => { setOpen(false); a.onClick(); }}
                    className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-ink-700/60 ${TONE[a.tone ?? "default"]}`}
                  >
                    <Icon name={a.icon} className="h-4 w-4" />
                    {a.label}
                  </button>
                ))}
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
