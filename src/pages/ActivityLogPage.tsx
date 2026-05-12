import { trpc } from "@/providers/trpc";
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  Heart,
  Star,
  Archive,
  RefreshCw,
  Eye,
  Share2,
} from "lucide-react";

const actionIcons: Record<string, React.ElementType> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  view: Eye,
  share: Share2,
  favorite: Heart,
  unfavorite: Star,
  archive: Archive,
  restore: RefreshCw,
};

const actionColors: Record<string, string> = {
  create: "#10B981",
  update: "#3B82F6",
  delete: "#EF4444",
  view: "#6B7280",
  share: "#8B5CF6",
  favorite: "#EC4899",
  unfavorite: "#F59E0B",
  archive: "#6B7280",
  restore: "#10B981",
};

export default function ActivityLogPage() {
  const logsQuery = trpc.activityLog.list.useQuery({
    page: 1,
    limit: 50,
  });

  const logs = logsQuery.data?.logs ?? [];

  return (
    <div className="p-6 md:p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1
          className="text-white font-normal"
          style={{ fontSize: "28px", letterSpacing: "-0.01em" }}
        >
          Activity Log
        </h1>
        <p
          className="mt-1"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}
        >
          Track everything that happens in your vault
        </p>
      </div>

      <div className="flex flex-col gap-0">
        {logs.map((log, index) => {
          const Icon = actionIcons[log.action] || Clock;
          const color = actionColors[log.action] || "#6B7280";
          return (
            <div
              key={log.id}
              className="flex items-start gap-4 py-4"
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                animationDelay: `${index * 30}ms`,
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                style={{
                  width: 36,
                  height: 36,
                  background: `${color}15`,
                }}
              >
                <Icon size={16} style={{ color }} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-mono px-2 py-0.5 rounded-md"
                    style={{
                      fontSize: "10px",
                      background: `${color}15`,
                      color,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {log.action}
                  </span>
                  <span
                    className="font-mono px-2 py-0.5 rounded-md"
                    style={{
                      fontSize: "10px",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                    }}
                  >
                    {log.entityType}
                  </span>
                </div>
                <p
                  className="mt-2"
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.5,
                  }}
                >
                  {log.details}
                </p>
                <span
                  className="font-mono mt-1 block"
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Clock
            size={48}
            style={{ color: "rgba(255,255,255,0.15)" }}
            strokeWidth={1}
          />
          <p
            className="mt-4"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}
          >
            No activity yet
          </p>
        </div>
      )}
    </div>
  );
}
