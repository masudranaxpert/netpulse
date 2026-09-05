export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages?: number;
  current_page?: number;
  results: T[];
};

export type Customer = {
  id: number;
  customer_id: string;
  customer_name: string;
  phone_number: string;
  address?: string;
  customer_status: "active" | "disconnected" | "free" | "left";
  zone?: number | null;
  zone_name?: string;
  package_name?: string;
  balance: string;
  billing_date?: string | null;
  extended_billing_days?: number;
  pppoe_name?: string | null;
  created_at?: string;
};

export type RouterInfo = {
  pppoe_name: string;
  pppoe_pass: string;
  profile_name?: string;
  remote_ip?: string | null;
  router: number | null;
  router_name?: string | null;
};

export type BillingSummary = {
  total_billed: number | string;
  total_paid: number | string;
  pending_amount: number | string;
  monthly_bill_count: number;
  connection_fee_count: number;
};

export type CustomerDetail = {
  id: number;
  customer_id: string;
  customer_name: string;
  nid?: string | null;
  phone_number: string;
  phone_number2?: string | null;
  address: string;
  zone: number | null;
  package: number | null;
  zone_name?: string;
  package_name?: string;
  package_price?: string | null;
  billing_date?: string | null;
  extended_billing_days?: number;
  customer_status: string;
  balance: string;
  router_info?: RouterInfo | null;
  billing_summary?: BillingSummary;
};

export type LiveStats = {
  status: "online" | "offline" | "error";
  live_stats_available: boolean;
  uptime?: string;
  bytes_in?: string;
  bytes_out?: string;
  packets_in?: string;
  packets_out?: string;
  caller_id?: string;
  address?: string;
  session_id?: string;
  encoding?: string;
  profile?: string;
  service?: string;
  last_logged_in?: string;
  last_logged_out?: string;
  last_caller?: string;
  last_disconnect_reason?: string;
  disabled?: string;
  message?: string;
};

export type Zone = {
  id: number;
  name: string;
  created_at?: string;
};

export type Package = {
  id: number;
  name: string;
  package_type?: string;
  speed?: string;
  price: string;
  description?: string;
  is_active: boolean;
};

export type Router = {
  id: number;
  name: string;
  host: string;
  port?: number;
  username?: string;
  password?: string;
  use_ssl?: boolean;
  status?: string;
  is_active: boolean;
  last_checked?: string | null;
  description?: string;
};

export type TicketReply = {
  id: number;
  author_name: string;
  author_type: "admin" | "customer" | "system";
  reply_text: string;
  created_at?: string;
};

export type Ticket = {
  id: number;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  customer?: number;
  customer_name?: string;
  customer_id?: string;
  replies?: TicketReply[];
  created_at?: string;
};

export type MonthlyBill = {
  id: number;
  customer_name?: string;
  package_name?: string;
  total_amount: string;
  paid_amount: string;
  remaining_amount: string;
  payment_status: string;
  billing_period?: string;
  invoice_date?: string;
};

export type Transaction = {
  id: number;
  customer_name?: string;
  amount: string;
  payment_method: string;
  transaction_id?: string | null;
  received_by_username?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type SchedulerTask = {
  task_id: string;
  name: string;
  status: "on" | "off" | "not_created";
  next_run?: string | null;
  schedule_type?: string | null;
};

export type OltDevice = {
  id: number;
  name: string;
  host: string;
  telnet_port: number;
  web_port: number;
  protocol: string;
  olt_type: string;
  vendor: string;
  pon_type: string;
  telnet_username: string;
  telnet_password: string;
  snmp_port: number;
  snmp_community: string;
  timeout: number;
  status: string;
  last_checked?: string | null;
  description: string;
  is_active: boolean;
  onu_count?: number;
  created_at?: string;
};

export type Onu = {
  id: number;
  olt: number;
  olt_name?: string;
  onu_index: string;
  serial_number: string;
  name: string;
  pon_port: string;
  onu_model: string;
  status: string;
  rx_power?: string | null;
  tx_power?: string | null;
  olt_rx_power?: string | null;
  distance?: number | null;
  customer?: number | null;
  customer_name?: string;
  customer_code?: string;
  last_seen?: string | null;
  description: string;
  created_at?: string;
};

export type SmsProviderField = { key: string; label: string; secret: boolean; required: boolean };
export type SmsProvider = { key: string; label: string; fields: SmsProviderField[] };

export type SmsGateway = {
  id: number;
  provider: string;
  label: string;
  sender_id: string;
  credentials: Record<string, unknown>;
  is_active: boolean;
  is_default: boolean;
  created_at?: string;
};

export type SmsTemplate = {
  id: number;
  name: string;
  category: string;
  body: string;
  created_at?: string;
};

export type SmsLog = {
  id: number;
  customer?: number | null;
  customer_name?: string;
  mobile: string;
  message: string;
  provider: string;
  status: "sent" | "failed" | "queued";
  response: string;
  sent_by_username?: string;
  created_at?: string;
};
