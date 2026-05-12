import { getDb } from "../api/queries/connection";
import {
  users,
  vaultFolders,
  vaultItems,
  activityLogs,
  userSettings,
} from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();

  console.log("Seeding database...");

  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length === 0) {
    console.log("No users found. Please login first to create a user.");
    console.log("Seed data requires an authenticated user.");
    return;
  }

  const userId = existingUsers[0].id;

  const existingFolders = await db
    .select()
    .from(vaultFolders)
    .where(eq(vaultFolders.userId, userId))
    .limit(1);

  if (existingFolders.length > 0) {
    console.log("Data already seeded for this user.");
    return;
  }

  const folderData = [
    { name: "Personal", color: "#FF6B2C" },
    { name: "Work", color: "#3B82F6" },
    { name: "Projects", color: "#10B981" },
    { name: "Archive", color: "#6B7280" },
    { name: "Learning", color: "#8B5CF6" },
    { name: "Finance", color: "#F59E0B" },
    { name: "Design Assets", color: "#EC4899" },
    { name: "Quick Notes", color: "#06B6D4" },
  ];

  const folderIds: number[] = [];
  for (const folder of folderData) {
    const result = await db.insert(vaultFolders).values({
      userId,
      parentId: null,
      name: folder.name,
      color: folder.color,
    });
    folderIds.push(Number(result[0].insertId));
  }

  const itemData = [
    {
      type: "note" as const,
      title: "Project Architecture Notes",
      content:
        "## System Design\n\n### Frontend\n- React 19 + TypeScript\n- Tailwind CSS + shadcn/ui\n- Framer Motion animations\n\n### Backend\n- tRPC + Drizzle ORM\n- MySQL database\n- OAuth 2.0 auth\n\n### Key Decisions\n1. Use server-side rendering for SEO\n2. Implement real-time sync with WebSockets\n3. AES-256 encryption for sensitive data",
      description: "Architecture overview for the new platform",
      language: "markdown",
      tags: ["architecture", "planning"],
      folderId: folderIds[2],
    },
    {
      type: "snippet" as const,
      title: "React useLocalStorage Hook",
      content:
        'import { useState, useEffect } from "react";\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [stored, setStored] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    window.localStorage.setItem(key, JSON.stringify(stored));\n  }, [key, stored]);\n\n  return [stored, setStored] as const;\n}',
      description: "Type-safe localStorage hook with SSR support",
      language: "typescript",
      tags: ["react", "hooks", "typescript"],
      folderId: folderIds[1],
    },
    {
      type: "url" as const,
      title: "Drizzle ORM Documentation",
      content: "https://orm.drizzle.team/docs/overview",
      description: "Official docs for Drizzle ORM",
      tags: ["docs", "database"],
      folderId: folderIds[1],
    },
    {
      type: "snippet" as const,
      title: "Python Data Processing Pipeline",
      content:
        "import pandas as pd\nfrom typing import List, Dict\n\ndef process_dataset(files: List[str]) -> Dict[str, pd.DataFrame]:\n    results = {}\n    for file in files:\n        df = pd.read_csv(file)\n        df = df.dropna()\n        df['timestamp'] = pd.to_datetime(df['timestamp'])\n        results[file] = df\n    return results\n\n# Usage\ndata = process_dataset(['sales.csv', 'users.csv'])",
      description: "Pipeline for processing CSV datasets",
      language: "python",
      tags: ["python", "data", "pandas"],
      folderId: folderIds[1],
    },
    {
      type: "note" as const,
      title: "Weekly Meeting Notes - May 2026",
      content:
        "# Week of May 4\n\n## Monday\n- Reviewed Q2 roadmap\n- Assigned tasks to team\n- **Action**: Finalize API contracts by Wednesday\n\n## Wednesday\n- API contracts approved\n- Started implementation of auth module\n- Blocked on: Design review for dashboard\n\n## Friday\n- Auth module 80% complete\n- Dashboard wireframes approved\n- **Next week**: Start file upload module",
      description: "Weekly standup and meeting notes",
      language: "markdown",
      tags: ["meetings", "weekly"],
      folderId: folderIds[0],
    },
    {
      type: "url" as const,
      title: "Framer Motion Animation Examples",
      content: "https://www.framer.com/motion/examples/",
      description: "Animation library examples and patterns",
      tags: ["animation", "frontend"],
      folderId: folderIds[2],
    },
    {
      type: "snippet" as const,
      title: "SQL Query - User Analytics",
      content:
        "SELECT \n  u.id,\n  u.name,\n  COUNT(vi.id) as item_count,\n  COUNT(vf.id) as folder_count,\n  MAX(vi.createdAt) as last_active\nFROM users u\nLEFT JOIN vault_items vi ON vi.userId = u.id\nLEFT JOIN vault_folders vf ON vf.userId = u.id\nWHERE vi.isArchived = false\nGROUP BY u.id\nORDER BY item_count DESC;",
      description: "Dashboard analytics query",
      language: "sql",
      tags: ["sql", "analytics"],
      folderId: folderIds[1],
    },
    {
      type: "note" as const,
      title: "Book Notes: Designing Data-Intensive Applications",
      content:
        "## Chapter 1: Reliable, Scalable, Maintainable\n\n### Reliability\n- Fault tolerance vs. prevention\n- Hardware failures are normal at scale\n- Software errors: cascading failures\n\n### Scalability\n- Load parameters: requests/sec, data volume\n- Latency percentiles (p50, p99)\n- Twitter case study: fan-out problem\n\n### Maintainability\n- Operability: monitoring, documentation\n- Simplicity: abstraction layers\n- Evolvability: easy to change",
      description: "Notes from Martin Kleppmann's book",
      language: "markdown",
      tags: ["books", "learning", "system-design"],
      folderId: folderIds[4],
    },
    {
      type: "prompt" as const,
      title: "Code Review Assistant",
      content:
        "You are a senior software engineer conducting a code review. Analyze the provided code for:\n\n1. **Code Quality**: Readability, naming conventions, consistency\n2. **Performance**: Inefficient algorithms, memory leaks, unnecessary re-renders\n3. **Security**: SQL injection risks, XSS vulnerabilities, auth flaws\n4. **Architecture**: Proper separation of concerns, design patterns\n5. **Testing**: Missing test cases, edge cases not covered\n\nProvide specific, actionable feedback with code examples where applicable. Rate each category 1-10.",
      description: "AI prompt for automated code reviews",
      tags: ["ai", "productivity", "code-review"],
      folderId: folderIds[2],
    },
    {
      type: "url" as const,
      title: "shadcn/ui Component Registry",
      content: "https://ui.shadcn.com/docs/components/accordion",
      description: "UI component documentation",
      tags: ["ui", "components"],
      folderId: folderIds[6],
    },
    {
      type: "snippet" as const,
      title: "Docker Compose - Full Stack",
      content:
        "version: '3.8'\n\nservices:\n  app:\n    build: .\n    ports:\n      - '3000:3000'\n    environment:\n      - DATABASE_URL=mysql://user:pass@db:3306/vault\n      - JWT_SECRET=your-secret\n    depends_on:\n      - db\n\n  db:\n    image: mysql:8\n    environment:\n      MYSQL_ROOT_PASSWORD: rootpass\n      MYSQL_DATABASE: vault\n    volumes:\n      - db_data:/var/lib/mysql\n\nvolumes:\n  db_data:",
      description: "Docker setup for production deployment",
      language: "yaml",
      tags: ["docker", "devops", "deployment"],
      folderId: folderIds[2],
    },
    {
      type: "note" as const,
      title: "Personal Finance Tracker - Q2 2026",
      content:
        "## April 2026\n\n| Category | Budget | Actual | Variance |\n|----------|--------|--------|----------|\n| Housing | $2,500 | $2,500 | $0 |\n| Food | $600 | $720 | -$120 |\n| Transport | $300 | $280 | +$20 |\n| Entertainment | $200 | $350 | -$150 |\n| Savings | $1,000 | $800 | -$200 |\n\n**Total Variance: -$450**\n\n## Action Items\n- Reduce dining out frequency\n- Cancel unused subscriptions ($45/mo)\n- Increase savings target for May",
      description: "Monthly budget tracking",
      language: "markdown",
      tags: ["finance", "personal"],
      folderId: folderIds[5],
    },
    {
      type: "prompt" as const,
      title: "Technical Documentation Writer",
      content:
        "Write clear, comprehensive technical documentation for the following code/component. Include:\n\n1. **Overview**: What does this do and why?\n2. **Prerequisites**: Required knowledge, dependencies\n3. **Usage**: Code examples with common scenarios\n4. **API Reference**: All props, methods, parameters with types\n5. **Edge Cases**: Known limitations and workarounds\n6. **Examples**: At least 3 practical examples\n\nWrite in a professional but approachable tone. Use Markdown formatting. Include TypeScript types where relevant.",
      description: "AI prompt for generating technical docs",
      tags: ["ai", "documentation"],
      folderId: folderIds[2],
    },
    {
      type: "url" as const,
      title: "Coolors - Color Palette Generator",
      content: "https://coolors.co/",
      description: "Tool for generating color palettes",
      tags: ["design", "tools"],
      folderId: folderIds[6],
    },
    {
      type: "snippet" as const,
      title: "Bash - Server Health Check",
      content:
        "#!/bin/bash\n\necho '=== Server Health Check ==='\necho 'Date: $(date)'\n\necho '--- CPU Usage ---'\ntop -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1\n\necho '--- Memory ---'\nfree -h | awk '/^Mem:/ {print \"Used: \"$3\" / \"$2}'\n\necho '--- Disk ---'\ndf -h / | awk 'NR==2 {print \"Used: \"$3\" / \"$2\" (\"$5\")\"}'\n\necho '--- Services ---'\nfor service in mysql nginx app; do\n  if systemctl is-active --quiet $service; then\n    echo \"$service: running\"\n  else\n    echo \"$service: DOWN\"\n  fi\ndone",
      description: "Automated server health monitoring script",
      language: "bash",
      tags: ["bash", "devops", "monitoring"],
      folderId: folderIds[1],
    },
    {
      type: "note" as const,
      title: "Learning Path: Advanced TypeScript",
      content:
        "## Module 1: Generics Deep Dive\n- [x] Generic constraints\n- [x] Conditional types\n- [x] Mapped types\n- [ ] Template literal types\n- [ ] Recursive type aliases\n\n## Module 2: Type-Level Programming\n- [ ] Type inference helpers\n- [ ] Brand types & nominal typing\n- [ ] Parser combinators at the type level\n\n## Module 3: Performance\n- [ ] Avoiding deep instantiation\n- [ ] Using interfaces vs types\n- [ ] Lazy evaluation patterns",
      description: "Self-paced TypeScript learning curriculum",
      language: "markdown",
      tags: ["typescript", "learning", "programming"],
      folderId: folderIds[4],
    },
    {
      type: "snippet" as const,
      title: "CSS Grid - Dashboard Layout",
      content:
        ".dashboard {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-rows: 64px 1fr;\n  grid-template-areas:\n    'sidebar header'\n    'sidebar main';\n  min-height: 100vh;\n  gap: 0;\n}\n\n.sidebar { grid-area: sidebar; }\n.header { grid-area: header; }\n.main {\n  grid-area: main;\n  padding: 24px;\n  overflow-y: auto;\n}\n\n@media (max-width: 768px) {\n  .dashboard {\n    grid-template-columns: 1fr;\n    grid-template-areas:\n      'header'\n      'main';\n  }\n  .sidebar { display: none; }\n}",
      description: "Responsive dashboard grid layout",
      language: "css",
      tags: ["css", "layout", "responsive"],
      folderId: folderIds[6],
    },
    {
      type: "url" as const,
      title: "Hono - Ultrafast Web Framework",
      content: "https://hono.dev/",
      description: "Lightweight web framework for the edge",
      tags: ["backend", "framework"],
      folderId: folderIds[1],
    },
    {
      type: "note" as const,
      title: "Product Launch Checklist",
      content:
        "## Pre-Launch\n- [ ] Final QA testing complete\n- [ ] Performance benchmarks met\n- [ ] Security audit passed\n- [ ] Documentation updated\n- [ ] Marketing materials ready\n\n## Launch Day\n- [ ] Database backups verified\n- [ ] Monitoring dashboards active\n- [ ] Rollback plan documented\n- [ ] Support team on standby\n- [ ] Announcement posts scheduled\n\n## Post-Launch\n- [ ] Monitor error rates (first 24h)\n- [ ] Collect user feedback\n- [ ] Track conversion metrics\n- [ ] Plan first patch release",
      description: "Product launch day checklist",
      language: "markdown",
      tags: ["product", "checklist"],
      folderId: folderIds[0],
    },
    {
      type: "snippet" as const,
      title: "tRPC Router with Zod Validation",
      content:
        "import { z } from 'zod';\nimport { createRouter, authedQuery } from './middleware';\nimport { getDb } from './queries/connection';\nimport { items } from '@db/schema';\nimport { eq, desc } from 'drizzle-orm';\n\nexport const itemRouter = createRouter({\n  list: authedQuery\n    .input(z.object({\n      page: z.number().default(1),\n      limit: z.number().default(20),\n    }))\n    .query(async ({ ctx, input }) => {\n      const db = getDb();\n      return db\n        .select()\n        .from(items)\n        .where(eq(items.userId, ctx.user.id))\n        .orderBy(desc(items.createdAt))\n        .limit(input.limit)\n        .offset((input.page - 1) * input.limit);\n    }),\n});",
      description: "Example tRPC router with full type safety",
      language: "typescript",
      tags: ["trpc", "backend", "typescript"],
      folderId: folderIds[1],
    },
  ];

  for (const item of itemData) {
    const isFav = Math.random() > 0.7;
    const result = await db.insert(vaultItems).values({
      userId,
      folderId: item.folderId ?? null,
      type: item.type,
      title: item.title,
      content: item.content,
      description: item.description ?? null,
      language: item.language ?? null,
      tags: JSON.stringify(item.tags),
      isFavorite: isFav,
      isArchived: false,
    });

    await db.insert(activityLogs).values({
      userId,
      action: "create",
      entityType: "item",
      entityId: Number(result[0].insertId),
      details: `Created ${item.type}: ${item.title}`,
    });

    if (isFav) {
      await db.insert(activityLogs).values({
        userId,
        action: "favorite",
        entityType: "item",
        entityId: Number(result[0].insertId),
        details: `Favorited ${item.type}: ${item.title}`,
      });
    }
  }

  await db.insert(userSettings).values({
    userId,
    theme: "dark",
    language: "en",
    defaultView: "grid",
    itemsPerPage: 20,
    emailNotifications: true,
    twoFactorEnabled: false,
    encryptionEnabled: false,
  });

  console.log(`Seeded ${folderData.length} folders, ${itemData.length} items`);
  console.log("Seed complete!");
}

seed().catch(console.error);
