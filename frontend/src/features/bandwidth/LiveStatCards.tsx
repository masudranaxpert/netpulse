import { StatCard } from "@/shared/components/ui/StatCard";
import { bitrate } from "@/shared/utils/format";

type Props = {
  onlineClients: number;
  downloadBps: number;
  uploadBps: number;
  connected: boolean;
};

export function LiveStatCards({ onlineClients, downloadBps, uploadBps, connected }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Online PPPoE Clients"
        value={onlineClients}
        icon="users"
        accent="brand"
        hint="Active sessions right now"
      />
      <StatCard
        label="Live Download Speed"
        value={bitrate(downloadBps)}
        icon="download"
        accent="sky"
        hint="Aggregated RX across routers"
      />
      <StatCard
        label="Live Upload Speed"
        value={bitrate(uploadBps)}
        icon="upload"
        accent="violet"
        hint="Aggregated TX across routers"
      />
      <StatCard
        label="Router API Connection"
        value={connected ? "Online" : "Offline"}
        icon="router"
        accent={connected ? "brand" : "amber"}
        hint={connected ? "RouterOS API reachable" : "No routers reachable"}
      />
    </div>
  );
}
