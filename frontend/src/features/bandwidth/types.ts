export type LiveSession = {
  pppoe_id: string;
  customer_id: string | null;
  customer_name: string;
  address: string;
  caller_id: string;
  uptime: string;
  download_bytes: number;
  upload_bytes: number;
  profile: string;
  billing_status: string;
  balance: number;
  router: string;
  router_id: number;
};

export type LiveUsage = {
  router_connected: boolean;
  router_count: number;
  online_clients: number;
  total_download_bytes: number;
  total_upload_bytes: number;
  timestamp: number;
  sessions: LiveSession[];
};

export type ConsumptionWindow = {
  upload_bytes: number;
  download_bytes: number;
  total_bytes: number;
};

export type WeeklyPoint = {
  date: string;
  label: string;
  download_bytes: number;
  upload_bytes: number;
};

export type ConsumptionSummary = {
  today: ConsumptionWindow;
  last_7_days: ConsumptionWindow;
  last_30_days: ConsumptionWindow;
  weekly: WeeklyPoint[];
};

export type UsageLog = {
  id: number;
  date: string;
  pppoe_id: string;
  customer_name: string;
  upload_bytes: number;
  download_bytes: number;
  total_bytes: number;
  uptime: string;
  router: string;
};

export type UsageLogsResponse = { results: UsageLog[]; totals: ConsumptionWindow };

export type TopUser = {
  pppoe_id: string;
  customer_name: string;
  upload_bytes: number;
  download_bytes: number;
  total_bytes: number;
  sessions: number;
};

export type RouterSummary = {
  router: string;
  upload_bytes: number;
  download_bytes: number;
  total_bytes: number;
  sessions: number;
  clients: number;
};

export type ReportFilterState = {
  date_from: string;
  date_to: string;
  router: string;
  customer: string;
};
