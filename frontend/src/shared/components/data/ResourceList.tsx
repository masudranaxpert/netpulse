import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Column } from "@/shared/components/data/DataTable";
import { DataTable } from "@/shared/components/data/DataTable";
import { ListPageSection } from "@/shared/components/data/ListPageSection";
import { TablePagination } from "@/shared/components/data/TablePagination";
import type { IconName } from "@/shared/components/icons/Icon";
import { SearchField } from "@/shared/components/ui/SearchField";
import { useFilteredList } from "@/shared/hooks/useFilteredList";

type Props<T extends object> = {
  queryKey: string;
  url: string;
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon?: IconName;
  pageSize?: number;
  toolbarAction?: ReactNode;
  filters?: ReactNode;
  params?: Record<string, string | number | undefined>;
  filterRows?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
};

export function ResourceList<T extends object>(props: Props<T>) {
  const { queryKey, url, columns, rowKey, searchPlaceholder, pageSize = 10, toolbarAction, filters, params, filterRows, onRowClick } = props;
  const { search, setSearch, query, results, total } = useFilteredList<T>(queryKey, url, params);
  const visible = useMemo(
    () => (filterRows ? results.filter(filterRows) : results),
    [results, filterRows],
  );
  const isEmpty = !query.isLoading && visible.length === 0;
  const [page, setPage] = useState(1);
  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => setPage(1), [search, paramsKey]);

  const totalPages = Math.ceil(visible.length / pageSize);
  const paged = useMemo(
    () => visible.slice((page - 1) * pageSize, page * pageSize),
    [visible, page, pageSize],
  );
  const start = visible.length === 0 ? 0 : (page - 1) * pageSize + 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <SearchField value={search} onChange={setSearch} placeholder={searchPlaceholder} />
          {filters}
        </div>
        <div className="flex items-center gap-3">
          {!query.isLoading ? (
            <span className="text-sm text-slate-400">
              {visible.length} of {total}
            </span>
          ) : null}
          {toolbarAction}
        </div>
      </div>
      <ListPageSection
        isLoading={query.isLoading}
        isError={query.isError}
        isEmpty={isEmpty}
        emptyTitle={props.emptyTitle}
        emptyDescription={props.emptyDescription}
        emptyIcon={props.emptyIcon}
      >
        <DataTable columns={columns} rows={paged} rowKey={rowKey} onRowClick={onRowClick} />
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPage={(p) => setPage(Math.min(Math.max(p, 1), totalPages))}
          rangeLabel={`Showing ${start}–${Math.min(page * pageSize, visible.length)} of ${visible.length}`}
        />
      </ListPageSection>
    </div>
  );
}
