import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { activityLogs } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const activityLogRouter = createRouter({
  list: authedQuery
    .input(
      z
        .object({
          page: z.number().default(1),
          limit: z.number().default(20),
          action: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const conditions = [eq(activityLogs.userId, ctx.user.id)];
      if (input?.action) {
        conditions.push(eq(activityLogs.action, input.action as "create" | "update" | "delete" | "view" | "share" | "favorite" | "unfavorite" | "archive" | "restore"));
      }

      const logs = await db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, ctx.user.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(activityLogs)
        .where(eq(activityLogs.userId, ctx.user.id));

      return {
        logs,
        total: countResult[0]?.count ?? 0,
        page,
        pages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),

  getRecent: authedQuery
    .input(z.object({ limit: z.number().default(5) }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const limit = input?.limit ?? 5;

      const logs = await db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, ctx.user.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit);

      return logs;
    }),
});
