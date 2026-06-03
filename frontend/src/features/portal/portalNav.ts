import type { IconName } from "@/shared/components/icons/Icon";
import { ROUTES } from "@/shared/constants/routes";

export type PortalNavItem = { label: string; to: string; icon: IconName };

export const PORTAL_NAV: PortalNavItem[] = [
  { label: "Overview", to: ROUTES.portal, icon: "dashboard" },
  { label: "My Bills", to: ROUTES.portalBills, icon: "billing" },
  { label: "Support", to: ROUTES.portalTickets, icon: "ticket" },
];
