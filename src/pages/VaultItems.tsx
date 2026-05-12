import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  FolderOpen,
  FileText,
  Link2,
  Code2,
  Sparkles,
  Image,
  Search,
  Grid3X3,
  List,
  Heart,
  Trash2,
  Pencil,
  X,
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

const typeLabels: Record<string, string> = {
  file: "Files",
  note: "Notes",
  url: "URLs",
  snippet: "Snippets",
  prompt: "AI Prompts",
  media: "Media",
};

interface VaultItemsPageProps {
  typeFilter?: string;
  title?: string;
}

export default function VaultItems({
  typeFilter,
  title = "All Items",
}: VaultItemsPageProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState("note");
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createLang, setCreateLang] = useState("");
  const [createTags, setCreateTags] = useState("");
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const utils = trpc.useUtils();
  const itemsQuery = trpc.vaultItem.list.useQuery({
    type: typeFilter as
      | "file"
      | "url"
      | "note"
      | "snippet"
      | "prompt"
      | "media"
      | undefined,
    search: search || undefined,
    page: 1,
    limit: 50,
  });

  const createMutation = trpc.vaultItem.create.useMutation({
    onSuccess: () => {
      utils.vaultItem.list.invalidate();
      utils.vaultItem.getStats.invalidate();
      setShowCreate(false);
      resetCreateForm();
    },
  });

  const updateMutation = trpc.vaultItem.update.useMutation({
    onSuccess: () => {
      utils.vaultItem.list.invalidate();
      setEditingItem(null);
    },
  });

  const deleteMutation = trpc.vaultItem.delete.useMutation({
    onSuccess: () => {
      utils.vaultItem.list.invalidate();
      utils.vaultItem.getStats.invalidate();
    },
  });

  const favoriteMutation = trpc.vaultItem.toggleFavorite.useMutation({
    onSuccess: () => {
      utils.vaultItem.list.invalidate();
    },
  });

  const items = itemsQuery.data?.items ?? [];

  function resetCreateForm() {
    setCreateTitle("");
    setCreateContent("");
    setCreateDesc("");
    setCreateLang("");
    setCreateTags("");
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createTitle.trim()) return;
    createMutation.mutate({
      type: createType as
        | "file"
        | "url"
        | "note"
        | "snippet"
        | "prompt"
        | "media",
      title: createTitle,
      content: createContent || undefined,
      description: createDesc || undefined,
      language: createLang || undefined,
      tags: createTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;
    updateMutation.mutate({
      id: editingItem,
      title: editTitle,
      content: editContent,
    });
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-white font-normal"
            style={{ fontSize: "28px", letterSpacing: "-0.01em" }}
          >
            {title}
          </h1>
          <p
            className="mt-1"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}
          >
            {items.length} items
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Search size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white outline-none"
              style={{ fontSize: "13px", width: 160 }}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              </button>
            )}
          </div>
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
            <button
              onClick={() => setView("grid")}
              className="p-2 transition-colors duration-200"
              style={{
                background: view === "grid" ? "rgba(255,255,255,0.08)" : "transparent",
                color: view === "grid" ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className="p-2 transition-colors duration-200"
              style={{
                background: view === "list" ? "rgba(255,255,255,0.08)" : "transparent",
                color: view === "list" ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              <List size={16} />
            </button>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2"
            style={{ padding: "10px 20px", fontSize: "13px" }}
          >
            <span className="text-lg leading-none">+</span> New
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const Icon = typeIcons[item.type] || FolderOpen;
            const color = typeColors[item.type] || "#6B7280";
            return (
              <div
                key={item.id}
                className="glass-card p-5 hover-lift group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: 40,
                      height: 40,
                      background: `${color}15`,
                    }}
                  >
                    <Icon size={20} style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        favoriteMutation.mutate({ id: item.id });
                      }}
                      className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                    >
                      <Heart
                        size={14}
                        style={{
                          color: item.isFavorite
                            ? "#EC4899"
                            : "rgba(255,255,255,0.4)",
                          fill: item.isFavorite ? "#EC4899" : "none",
                        }}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item.id);
                        setEditTitle(item.title);
                        setEditContent(item.content || "");
                      }}
                      className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                    >
                      <Pencil
                        size={14}
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate({ id: item.id });
                      }}
                      className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                    >
                      <Trash2
                        size={14}
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      />
                    </button>
                  </div>
                </div>
                <h3
                  className="text-white font-medium truncate"
                  style={{ fontSize: "14px" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-1 truncate"
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {item.description || item.type}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {item.tags &&
                    (typeof item.tags === "string"
                      ? JSON.parse(item.tags)
                      : item.tags
                    )
                      ?.slice(0, 2)
                      .map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="font-mono px-2 py-0.5 rounded-md"
                          style={{
                            fontSize: "10px",
                            background: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                  <span
                    className="ml-auto font-mono"
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = typeIcons[item.type] || FolderOpen;
            const color = typeColors[item.type] || "#6B7280";
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-white/5 group"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    background: `${color}15`,
                  }}
                >
                  <Icon size={16} style={{ color }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-white truncate"
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
                <div className="hidden md:flex items-center gap-2">
                  {item.tags &&
                    (typeof item.tags === "string"
                      ? JSON.parse(item.tags)
                      : item.tags
                    )
                      ?.slice(0, 2)
                      .map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="font-mono px-2 py-0.5 rounded-md"
                          style={{
                            fontSize: "10px",
                            background: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                </div>
                <span
                  className="font-mono hidden md:block flex-shrink-0"
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => favoriteMutation.mutate({ id: item.id })}
                    className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                  >
                    <Heart
                      size={14}
                      style={{
                        color: item.isFavorite
                          ? "#EC4899"
                          : "rgba(255,255,255,0.4)",
                        fill: item.isFavorite ? "#EC4899" : "none",
                      }}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item.id);
                      setEditTitle(item.title);
                      setEditContent(item.content || "");
                    }}
                    className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                  >
                    <Pencil size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate({ id: item.id })}
                    className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                  >
                    <Trash2 size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <FolderOpen
            size={48}
            style={{ color: "rgba(255,255,255,0.15)" }}
            strokeWidth={1}
          />
          <p
            className="mt-4"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}
          >
            No items found
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary mt-4"
            style={{ padding: "10px 24px", fontSize: "13px" }}
          >
            Create your first item
          </button>
        </div>
      )}

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => {
            setShowCreate(false);
            resetCreateForm();
          }}
        >
          <div
            className="w-full max-w-md p-6"
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border-subtle)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-white font-medium"
                style={{ fontSize: "18px" }}
              >
                New Item
              </h2>
              <button
                onClick={() => {
                  setShowCreate(false);
                  resetCreateForm();
                }}
              >
                <X size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Type
                </label>
                <select
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "14px",
                  }}
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Enter title..."
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Description
                </label>
                <input
                  type="text"
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  placeholder="Optional description..."
                  className="w-full px-4 py-2.5 rounded-lg text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Content
                </label>
                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder="Content..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg text-white outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2"
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    Language
                  </label>
                  <input
                    type="text"
                    value={createLang}
                    onChange={(e) => setCreateLang(e.target.value)}
                    placeholder="e.g. typescript"
                    className="w-full px-4 py-2.5 rounded-lg text-white outline-none"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2"
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={createTags}
                    onChange={(e) => setCreateTags(e.target.value)}
                    placeholder="tag1, tag2"
                    className="w-full px-4 py-2.5 rounded-lg text-white outline-none"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    resetCreateForm();
                  }}
                  className="btn-outline"
                  style={{ padding: "10px 20px", fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "10px 24px", fontSize: "13px" }}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setEditingItem(null)}
        >
          <div
            className="w-full max-w-md p-6"
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border-subtle)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-white font-medium"
                style={{ fontSize: "18px" }}
              >
                Edit Item
              </h2>
              <button onClick={() => setEditingItem(null)}>
                <X size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg text-white outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "14px",
                    fontFamily: "monospace",
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-outline"
                  style={{ padding: "10px 20px", fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "10px 24px", fontSize: "13px" }}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
