import type { IconName } from "@/shared/components/icons/Icon";
import { ROUTES } from "@/shared/constants/routes";

export type NavChild = {
  label: string;
  to: string;
};

export type NavItem = {
  label: string;
  to: string;
  icon: IconName;
  group: "Overview" | "Operations" | "Network" | "Bandwidth";
  children?: NavChild[];
};

export const CUSTOMER_SUBNAV: NavChild[] = [
  { label: "All clients", to: ROUTES.customers },
  { label: "Active", to: `${ROUTES.customers}?filter=active` },
  { label: "Due", to: `${ROUTES.customers}?filter=due` },
  { label: "Free", to: `${ROUTES.customers}?filter=free` },
  { label: "Inactive", to: `${ROUTES.customers}?filter=inactive` },
  { label: "Expired", to: `${ROUTES.customers}?filter=expired` },
  { label: "Left", to: `${ROUTES.customers}?filter=left` },
  { label: "Online monitoring", to: `${ROUTES.customers}?filter=online` },
];

export const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", to: ROUTES.dashboard, icon: "dashboard", group: "Overview" },
  { label: "Customers", to: ROUTES.customers, icon: "users", group: "Operations", children: CUSTOMER_SUBNAV },
  { label: "Packages", to: ROUTES.packages, icon: "package", group: "Operations" },
  { label: "Billing", to: ROUTES.billing, icon: "billing", group: "Operations" },
  { label: "Payments", to: ROUTES.payments, icon: "cash", group: "Operations" },
  { label: "SMS", to: ROUTES.sms, icon: "message", group: "Operations" },
  { label: "Tickets", to: ROUTES.tickets, icon: "ticket", group: "Operations" },
  { label: "Zones", to: ROUTES.zones, icon: "map", group: "Network" },
  { label: "Routers", to: ROUTES.routers, icon: "router", group: "Network" },
  { label: "OLT / ONU", to: ROUTES.olt, icon: "signal", group: "Network" },
  { label: "Scheduler", to: ROUTES.scheduler, icon: "clock", group: "Network" },
  { label: "Live Usage", to: ROUTES.bandwidthLive, icon: "activity", group: "Bandwidth" },
  { label: "Usage Reports", to: ROUTES.bandwidthReports, icon: "fileText", group: "Bandwidth" },
];

export const NAV_GROUPS = ["Overview", "Operations", "Network", "Bandwidth"] as const;
