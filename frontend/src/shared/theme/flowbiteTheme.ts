import { createTheme } from "flowbite-react";

export const ispTheme = createTheme({
  button: {
    color: {
      primary:
        "bg-brand-600 text-white hover:bg-brand-700 focus:ring-4 focus:ring-brand-200 dark:focus:ring-brand-800",
      light:
        "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    },
    size: { sm: "px-3 py-2 text-xs", md: "px-4 py-2.5 text-sm" },
  },
  card: {
    root: {
      base: "flex rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-ink-900",
      children: "flex h-full flex-col justify-center gap-3 p-5",
    },
  },
  table: {
    root: { wrapper: "relative" },
    head: {
      base: "group/head text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400",
      cell: {
        base: "bg-slate-50/80 px-5 py-3.5 font-semibold dark:bg-ink-800/60",
      },
    },
    body: { cell: { base: "px-5 py-4" } },
    row: {
      base: "border-b border-slate-100 transition-colors last:border-0 dark:border-slate-800",
    },
  },
  badge: {
    root: {
      color: {
        success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        failure: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
        warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        info: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
        gray: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
      },
    },
  },
  textInput: {
    field: {
      input: {
        base: "block w-full rounded-xl border-slate-200 bg-white text-sm focus:border-brand-500 focus:ring-brand-500 dark:border-slate-700 dark:bg-ink-800",
      },
    },
  },
});
