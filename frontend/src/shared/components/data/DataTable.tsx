import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({ columns, rows, rowKey, onRowClick }: Props<T>) {
  return (
    <div className="card-surface overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-ink-800/60 dark:text-slate-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 font-semibold ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-ink-800/40 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 text-slate-600 dark:text-slate-300 ${col.align === "right" ? "text-right" : ""}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
