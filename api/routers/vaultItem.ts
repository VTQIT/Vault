import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { vaultItems, activityLogs } from "@db/schema";
import { eq, and, desc, like, sql } from "drizzle-orm";

export const vaultItemRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        type: z
          .enum(["file", "url", "note", "snippet", "prompt", "media"])
          .optional(),
        folderId: z.number().optional(),
        search: z.string().optional(),
        favorite: z.boolean().optional(),
        archived: z.boolean().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(vaultItems.userId, ctx.user.id)];

      if (input.type) conditions.push(eq(vaultItems.type, input.type));
      if (input.folderId !== undefined)
        conditions.push(eq(vaultItems.folderId, input.folderId));
      if (input.favorite !== undefined)
        conditions.push(eq(vaultItems.isFavorite, input.favorite));
      if (input.archived !== undefined)
        conditions.push(eq(vaultItems.isArchived, input.archived));
      else conditions.push(eq(vaultItems.isArchived, false));

      if (input.search) {
        conditions.push(
          like(vaultItems.title, `%${input.search}%`)
        );
      }

      const offset = (input.page - 1) * input.limit;

      const items = await db
        .select()
        .from(vaultItems)
        .where(and(...conditions))
        .orderBy(desc(vaultItems.createdAt))
        .limit(input.limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(vaultItems)
        .where(and(...conditions));

      return {
        items,
        total: countResult[0]?.count ?? 0,
        page: input.page,
        pages: Math.ceil((countResult[0]?.count ?? 0) / input.limit),
      };
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const item = await db
        .select()
        .from(vaultItems)
        .where(
          and(
            eq(vaultItems.id, input.id),
            eq(vaultItems.userId, ctx.user.id)
          )
        )
        .limit(1);
      return item[0] ?? null;
    }),

  getStats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(vaultItems)
      .where(
        and(
          eq(vaultItems.userId, ctx.user.id),
          eq(vaultItems.isArchived, false)
        )
      );

    const byTypeResult = await db
      .select({
        type: vaultItems.type,
        count: sql<number>`count(*)`,
      })
      .from(vaultItems)
      .where(
        and(
          eq(vaultItems.userId, ctx.user.id),
          eq(vaultItems.isArchived, false)
        )
      )
      .groupBy(vaultItems.type);

    const recentResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(vaultItems)
      .where(
        and(
          eq(vaultItems.userId, ctx.user.id),
          sql`${vaultItems.createdAt} > DATE_SUB(NOW(), INTERVAL 7 DAY)`
        )
      );

    const byType: Record<string, number> = {};
    for (const row of byTypeResult) {
      byType[row.type] = row.count;
    }

    return {
      total: totalResult[0]?.count ?? 0,
      byType,
      recent: recentResult[0]?.count ?? 0,
    };
  }),

  create: authedQuery
    .input(
      z.object({
        type: z.enum(["file", "url", "note", "snippet", "prompt", "media"]),
        title: z.string().min(1).max(255),
        content: z.string().optional(),
        description: z.string().optional(),
        language: z.string().optional(),
        tags: z.array(z.string()).default([]),
        folderId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(vaultItems).values({
        userId: ctx.user.id,
        folderId: input.folderId ?? null,
        type: input.type,
        title: input.title,
        content: input.content ?? null,
        description: input.description ?? null,
        language: input.language ?? null,
        tags: JSON.stringify(input.tags),
      });

      const insertId = Number(result[0].insertId);

      await db.insert(activityLogs).values({
        userId: ctx.user.id,
        action: "create",
        entityType: "item",
        entityId: insertId,
        details: `Created ${input.type}: ${input.title}`,
      });

      return { id: insertId, ...input, userId: ctx.user.id };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().optional(),
        description: z.string().optional(),
        language: z.string().optional(),
        tags: z.array(z.string()).optional(),
        folderId: z.number().nullable().optional(),
        isFavorite: z.boolean().optional(),
        isArchived: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updateData } = input;

      const updateValues: Record<string, unknown> = {};
      if (updateData.title !== undefined) updateValues.title = updateData.title;
      if (updateData.content !== undefined)
        updateValues.content = updateData.content;
      if (updateData.description !== undefined)
        updateValues.description = updateData.description;
      if (updateData.language !== undefined)
        updateValues.language = updateData.language;
      if (updateData.tags !== undefined)
        updateValues.tags = JSON.stringify(updateData.tags);
      if (updateData.folderId !== undefined)
        updateValues.folderId = updateData.folderId;
      if (updateData.isFavorite !== undefined)
        updateValues.isFavorite = updateData.isFavorite;
      if (updateData.isArchived !== undefined)
        updateValues.isArchived = updateData.isArchived;

      await db
        .update(vaultItems)
        .set(updateValues)
        .where(
          and(eq(vaultItems.id, id), eq(vaultItems.userId, ctx.user.id))
        );

      await db.insert(activityLogs).values({
        userId: ctx.user.id,
        action: "update",
        entityType: "item",
        entityId: id,
        details: `Updated item #${id}`,
      });

      return { id, ...updateData };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      await db.insert(activityLogs).values({
        userId: ctx.user.id,
        action: "delete",
        entityType: "item",
        entityId: input.id,
        details: `Deleted item #${input.id}`,
      });

      await db
        .delete(vaultItems)
        .where(
          and(
            eq(vaultItems.id, input.id),
            eq(vaultItems.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  toggleFavorite: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const current = await db
        .select({ isFavorite: vaultItems.isFavorite })
        .from(vaultItems)
        .where(
          and(
            eq(vaultItems.id, input.id),
            eq(vaultItems.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!current[0]) return { success: false };

      const newValue = !current[0].isFavorite;

      await db
        .update(vaultItems)
        .set({ isFavorite: newValue })
        .where(
          and(
            eq(vaultItems.id, input.id),
            eq(vaultItems.userId, ctx.user.id)
          )
        );

      await db.insert(activityLogs).values({
        userId: ctx.user.id,
        action: newValue ? "favorite" : "unfavorite",
        entityType: "item",
        entityId: input.id,
        details: `${newValue ? "Favorited" : "Unfavorited"} item #${input.id}`,
      });

      return { id: input.id, isFavorite: newValue };
    }),
});
