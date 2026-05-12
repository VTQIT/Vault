import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { vaultFolders, vaultItems, activityLogs } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const vaultFolderRouter = createRouter({
  list: authedQuery
    .input(
      z
        .object({
          parentId: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(vaultFolders.userId, ctx.user.id)];

      if (input?.parentId !== undefined) {
        conditions.push(eq(vaultFolders.parentId, input.parentId));
      }

      const folders = await db
        .select()
        .from(vaultFolders)
        .where(and(...conditions))
        .orderBy(desc(vaultFolders.createdAt));

      return folders;
    }),

  getBreadcrumb: authedQuery
    .input(z.object({ folderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const breadcrumb: Array<{ id: number; name: string }> = [];

      let currentId: number | null = input.folderId;
      while (currentId) {
        const folder = await db
          .select()
          .from(vaultFolders)
          .where(
            and(
              eq(vaultFolders.id, currentId),
              eq(vaultFolders.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (!folder[0]) break;
        breadcrumb.unshift({ id: folder[0].id, name: folder[0].name });
        currentId = folder[0].parentId;
      }

      return breadcrumb;
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        parentId: z.number().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(vaultFolders).values({
        userId: ctx.user.id,
        parentId: input.parentId ?? null,
        name: input.name,
        color: input.color ?? null,
      });

      const insertId = Number(result[0].insertId);

      await db.insert(activityLogs).values({
        userId: ctx.user.id,
        action: "create",
        entityType: "folder",
        entityId: insertId,
        details: `Created folder: ${input.name}`,
      });

      return { id: insertId, ...input };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updateData } = input;

      await db
        .update(vaultFolders)
        .set(updateData)
        .where(
          and(
            eq(vaultFolders.id, id),
            eq(vaultFolders.userId, ctx.user.id)
          )
        );

      return { id, ...updateData };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      await db
        .update(vaultItems)
        .set({ folderId: null })
        .where(
          and(
            eq(vaultItems.folderId, input.id),
            eq(vaultItems.userId, ctx.user.id)
          )
        );

      await db
        .delete(vaultFolders)
        .where(
          and(
            eq(vaultFolders.id, input.id),
            eq(vaultFolders.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});
