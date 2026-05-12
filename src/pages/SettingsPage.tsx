import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Moon,
  Sun,
  Monitor,
  Globe,
  LayoutGrid,
  List,
  Bell,
  Lock,
  Shield,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { logout } = useAuth();
  const settingsQuery = trpc.userSetting.get.useQuery();
  const updateMutation = trpc.userSetting.update.useMutation();
  const utils = trpc.useUtils();

  const settings = settingsQuery.data;

  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [defaultView, setDefaultView] = useState<"grid" | "list">("grid");
  const [emailNotifications, setEmailNotifications] = useState(
    settings?.emailNotifications ?? true
  );
  const [encryptionEnabled, setEncryptionEnabled] = useState(
    settings?.encryptionEnabled ?? false
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (settings) {
      if (settings.theme) setTheme(settings.theme);
      if (settings.defaultView) setDefaultView(settings.defaultView);
      setEmailNotifications(settings.emailNotifications ?? true);
      setEncryptionEnabled(settings.encryptionEnabled ?? false);
    }
  }, [settings]);

  const handleUpdate = (updates: Record<string, unknown>) => {
    updateMutation.mutate(updates, {
      onSuccess: () => {
        utils.userSetting.get.invalidate();
      },
    });
  };

  const sections = [
    {
      title: "Appearance",
      items: [
        {
          icon: theme === "dark" ? Moon : theme === "light" ? Sun : Monitor,
          label: "Theme",
          description: "Choose your preferred color scheme",
          control: (
            <div className="flex items-center gap-2 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
              {(["dark", "light", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    handleUpdate({ theme: t });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 capitalize"
                  style={{
                    background: theme === t ? "rgba(255,255,255,0.08)" : "transparent",
                    color: theme === t ? "white" : "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                  }}
                >
                  {t === "dark" && <Moon size={14} />}
                  {t === "light" && <Sun size={14} />}
                  {t === "system" && <Monitor size={14} />}
                  {t}
                </button>
              ))}
            </div>
          ),
        },
        {
          icon: defaultView === "grid" ? LayoutGrid : List,
          label: "Default View",
          description: "Preferred layout for item lists",
          control: (
            <div className="flex items-center gap-2 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setDefaultView(v);
                    handleUpdate({ defaultView: v });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 capitalize"
                  style={{
                    background: defaultView === v ? "rgba(255,255,255,0.08)" : "transparent",
                    color: defaultView === v ? "white" : "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                  }}
                >
                  {v === "grid" ? <LayoutGrid size={14} /> : <List size={14} />}
                  {v}
                </button>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Email Notifications",
          description: "Receive email updates about your vault",
          control: (
            <button
              onClick={() => {
                const newVal = !emailNotifications;
                setEmailNotifications(newVal);
                handleUpdate({ emailNotifications: newVal });
              }}
              className="relative w-11 h-6 rounded-full transition-colors duration-300"
              style={{
                background: emailNotifications ? "var(--accent)" : "rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300"
                style={{
                  transform: emailNotifications
                    ? "translateX(22px)"
                    : "translateX(2px)",
                }}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          icon: Lock,
          label: "Encryption",
          description: "Enable end-to-end encryption for sensitive items",
          control: (
            <button
              onClick={() => {
                const newVal = !encryptionEnabled;
                setEncryptionEnabled(newVal);
                handleUpdate({ encryptionEnabled: newVal });
              }}
              className="relative w-11 h-6 rounded-full transition-colors duration-300"
              style={{
                background: encryptionEnabled ? "var(--accent)" : "rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300"
                style={{
                  transform: encryptionEnabled
                    ? "translateX(22px)"
                    : "translateX(2px)",
                }}
              />
            </button>
          ),
        },
        {
          icon: Shield,
          label: "Two-Factor Authentication",
          description: "Add an extra layer of security",
          control: (
            <span
              className="font-mono px-3 py-1.5 rounded-md"
              style={{
                fontSize: "12px",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Coming soon
            </span>
          ),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Globe,
          label: "Language",
          description: "Interface language",
          control: (
            <span
              className="font-mono px-3 py-1.5 rounded-md"
              style={{
                fontSize: "12px",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              English
            </span>
          ),
        },
        {
          icon: Trash2,
          label: "Delete Account",
          description: "Permanently delete your account and all data",
          control: (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-lg transition-all duration-200 hover:brightness-110"
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "#EF4444",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Delete
            </button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[800px]">
      <div className="mb-8">
        <h1
          className="text-white font-normal"
          style={{ fontSize: "28px", letterSpacing: "-0.01em" }}
        >
          Settings
        </h1>
        <p
          className="mt-1"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}
        >
          Manage your vault preferences
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2
              className="font-mono uppercase mb-4"
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.06em",
              }}
            >
              {section.title}
            </h2>
            <div className="flex flex-col gap-0">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-5"
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <item.icon
                      size={18}
                      style={{ color: "rgba(255,255,255,0.5)" }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-white"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="mt-0.5"
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={logout}
          className="w-full py-3 rounded-lg transition-all duration-200 hover:brightness-110"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-subtle)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Log out
        </button>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm p-6"
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-card)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} style={{ color: "#EF4444" }} />
              <h3
                className="text-white font-medium"
                style={{ fontSize: "18px" }}
              >
                Delete Account
              </h3>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
              }}
            >
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-outline"
                style={{ padding: "10px 20px", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  logout();
                }}
                style={{
                  padding: "10px 24px",
                  fontSize: "13px",
                  background: "#EF4444",
                  color: "white",
                  borderRadius: "var(--radius-pill)",
                  fontWeight: 500,
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
