export type PortalProfile = {
  customer_id: string;
  customer_name: string;
  phone_number: string;
  phone_number2?: string;
  address: string;
  zone_name?: string;
  package_name?: string;
  billing_date?: string;
  customer_status: string;
  balance: string;
  pppoe_name?: string;
};

export type LiveStats = {
  status: "online" | "offline" | string;
  live_stats_available: boolean;
  uptime?: string;
  bytes_in?: string;
  bytes_out?: string;
  address?: string;
  last_disconnect_reason?: string;
  message?: string;
};

export type PortalBill = {
  id: number;
  package_name?: string;
  billing_period?: string;
  invoice_date: string;
  total_amount: string;
  paid_amount: string;
  remaining_amount: string;
  payment_status: string;
  payment_date?: string | null;
};

export type PortalTicket = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

export type TicketReply = {
  id: number;
  reply_text: string;
  admin_user?: number | null;
  customer?: string | null;
  created_at: string;
};

export type PortalTicketDetail = PortalTicket & { replies: TicketReply[] };
