import type { ReactNode } from "react";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { TableSkeleton } from "@/shared/components/ui/TableSkeleton";
import type { IconName } from "@/shared/components/icons/Icon";

type Props = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon?: IconName;
  children: ReactNode;
};

export function ListPageSection({
  isLoading,
  isError,
  errorMessage,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  children,
}: Props) {
  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorAlert message={errorMessage ?? "Could not load data."} />;
  if (isEmpty)
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />;
  return <>{children}</>;
}
