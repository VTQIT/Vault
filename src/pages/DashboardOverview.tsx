import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  FolderOpen,
  FileText,
  Link2,
  Code2,
  Sparkles,
  Image,
  Clock,
  ArrowRight,
  Heart,
  TrendingUp,
  Shield,
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  file: FolderOpen,
  note: FileText,
  url: Link2,
  snippet: Code2,
  prompt: Sparkles,
  media: Image,
};

const typeColors: Record<string, string> = {
  file: "#3B82F6",
  note: "#10B981",
  url: "#06B6D4",
  snippet: "#8B5CF6",
  prompt: "#F59E0B",
  media: "#EC4899",
};

export default function DashboardOverview() {
  const statsQuery = trpc.vaultItem.getStats.useQuery();
  const recentItemsQuery = trpc.vaultItem.list.useQuery({ limit: 6, page: 1 });
  const recentLogsQuery = trpc.activityLog.getRecent.useQuery({ limit: 5 });

  const stats = statsQuery.data;
  const recentItems = recentItemsQuery.data?.items ?? [];
  const recentLogs = recentLogsQuery.data ?? [];

  const statCards = [
    {
      label: "Total Items",
      value: stats?.total ?? 0,
      icon: FolderOpen,
      color: "#3B82F6",
    },
    {
      label: "This Week",
      value: stats?.recent ?? 0,
      icon: TrendingUp,
      color: "#10B981",
    },
    {
      label: "Favorites",
      value: recentItems.filter((i) => i.isFavorite).length,
      icon: Heart,
      color: "#EC4899",
    },
    {
      label: "Vault Health",
      value: "100%",
      icon: Shield,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-white font-normal"
            style={{ fontSize: "28px", letterSpacing: "-0.01em" }}
          >
            Dashboard
          </h1>
          <p
            className="mt-1"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}
          >
            Overview of your vault
          </p>
        </div>
        <Link
          to="/dashboard/items"
          className="btn-primary flex items-center gap-2"
          style={{ padding: "10px 20px", fontSize: "13px" }}
        >
          <span className="text-lg leading-none">+</span> New Item
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="glass-card p-5 hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: card.color, opacity: 0.5 }}
              />
            </div>
            <div
              className="text-white font-light"
              style={{ fontSize: "28px", lineHeight: 1 }}
            >
              {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
            </div>
            <div
              className="mt-2"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-white font-medium"
              style={{ fontSize: "16px" }}
            >
              Recent Items
            </h2>
            <Link
              to="/dashboard/items"
              className="flex items-center gap-1 transition-colors duration-200 hover:text-white"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentItems.map((item) => {
              const Icon = typeIcons[item.type] || FolderOpen;
              const color = typeColors[item.type] || "#6B7280";
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-white/5 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      background: `${color}15`,
                    }}
                  >
                    <Icon size={18} style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="truncate text-white"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="truncate mt-0.5"
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {item.description || item.type}
                    </div>
                  </div>
                  <div
                    className="font-mono flex-shrink-0"
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-white font-medium"
              style={{ fontSize: "16px" }}
            >
              Activity
            </h2>
            <Link
              to="/dashboard/activity"
              className="flex items-center gap-1 transition-colors duration-200 hover:text-white"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-0">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 py-3"
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <Clock
                  size={14}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate"
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}
                  >
                    {log.details}
                  </div>
                  <div
                    className="mt-0.5 font-mono"
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
