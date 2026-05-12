import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  boolean,
  json,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const vaultFolders = mysqlTable("vault_folders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type VaultFolder = typeof vaultFolders.$inferSelect;

export const vaultItems = mysqlTable("vault_items", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  folderId: bigint("folderId", { mode: "number", unsigned: true }),
  type: mysqlEnum("type", ["file", "url", "note", "snippet", "prompt", "media"])
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  description: text("description"),
  language: varchar("language", { length: 50 }),
  tags: json("tags").default("[]"),
  isFavorite: boolean("isFavorite").default(false),
  isArchived: boolean("isArchived").default(false),
  fileSize: bigint("fileSize", { mode: "number" }),
  mimeType: varchar("mimeType", { length: 100 }),
  filePath: varchar("filePath", { length: 500 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type VaultItem = typeof vaultItems.$inferSelect;

export const activityLogs = mysqlTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  action: mysqlEnum("action", [
    "create",
    "update",
    "delete",
    "view",
    "share",
    "favorite",
    "unfavorite",
    "archive",
    "restore",
  ]).notNull(),
  entityType: mysqlEnum("entityType", ["item", "folder", "setting"]).notNull(),
  entityId: bigint("entityId", { mode: "number", unsigned: true }).notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;

export const userSettings = mysqlTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  theme: mysqlEnum("theme", ["dark", "light", "system"]).default("dark"),
  language: varchar("language", { length: 10 }).default("en"),
  defaultView: mysqlEnum("defaultView", ["grid", "list"]).default("grid"),
  itemsPerPage: int("itemsPerPage").default(20),
  emailNotifications: boolean("emailNotifications").default(true),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  encryptionEnabled: boolean("encryptionEnabled").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type UserSettings = typeof userSettings.$inferSelect;
