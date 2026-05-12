import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Link2,
  Code2,
  Image,
  Sparkles,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: FolderOpen, label: "All Items", path: "/dashboard/items" },
  { icon: FileText, label: "Notes", path: "/dashboard/notes" },
  { icon: Link2, label: "URLs", path: "/dashboard/urls" },
  { icon: Code2, label: "Snippets", path: "/dashboard/snippets" },
  { icon: Sparkles, label: "AI Prompts", path: "/dashboard/prompts" },
  { icon: Image, label: "Media", path: "/dashboard/media" },
  { icon: Clock, label: "Activity", path: "/dashboard/activity" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex h-screen" style={{ background: "var(--bg-void)" }}>
      <aside
        className="flex flex-col h-screen flex-shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 72 : 240,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="flex items-center gap-3 flex-shrink-0"
          style={{
            height: 64,
            padding: "0 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {!collapsed && (
            <Link
              to="/"
              className="text-white font-medium"
              style={{ fontSize: "16px", letterSpacing: "0.12em" }}
            >
              KAPTEN
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex items-center justify-center rounded-md transition-colors duration-200 hover:bg-white/5"
            style={{
              width: 32,
              height: 32,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-4">
            {!collapsed ? (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-white/5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Search size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Search...
                </span>
              </button>
            ) : (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-full flex items-center justify-center py-2 rounded-lg transition-colors duration-200 hover:bg-white/5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Search size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                    color: isActive ? "white" : "rgba(255,255,255,0.5)",
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  {!collapsed && (
                    <span style={{ fontSize: "13px", fontWeight: isActive ? 500 : 400 }}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div
          className="flex items-center gap-3 flex-shrink-0"
          style={{
            height: 64,
            padding: "0 16px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="rounded-full flex-shrink-0"
              style={{ width: 32, height: 32 }}
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                background: "var(--accent)",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div
                className="truncate"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "white",
                }}
              >
                {user?.name || "User"}
              </div>
              <div
                className="truncate"
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {user?.email || ""}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg mx-4 p-4"
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border-subtle)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Search size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
              <input
                autoFocus
                type="text"
                placeholder="Search your vault..."
                className="flex-1 bg-transparent text-white outline-none"
                style={{ fontSize: "15px" }}
              />
              <kbd
                className="font-mono px-2 py-1 rounded"
                style={{
                  fontSize: "11px",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                ESC
              </kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
