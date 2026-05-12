import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { userSettings } from "@db/schema";
import { eq } from "drizzle-orm";

export const userSettingRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, ctx.user.id))
      .limit(1);

    if (existing[0]) return existing[0];

    const defaultSettings = {
      userId: ctx.user.id,
      theme: "dark" as const,
      language: "en",
      defaultView: "grid" as const,
      itemsPerPage: 20,
      emailNotifications: true,
      twoFactorEnabled: false,
      encryptionEnabled: false,
    };

    await db.insert(userSettings).values(defaultSettings);

    return {
      ...defaultSettings,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }),

  update: authedQuery
    .input(
      z.object({
        theme: z.enum(["dark", "light", "system"]).optional(),
        language: z.string().optional(),
        defaultView: z.enum(["grid", "list"]).optional(),
        itemsPerPage: z.number().optional(),
        emailNotifications: z.boolean().optional(),
        encryptionEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const existing = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.user.id))
        .limit(1);

      if (existing[0]) {
        await db
          .update(userSettings)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(userSettings.userId, ctx.user.id));
      } else {
        await db.insert(userSettings).values({
          userId: ctx.user.id,
          theme: input.theme ?? "dark",
          language: input.language ?? "en",
          defaultView: input.defaultView ?? "grid",
          itemsPerPage: input.itemsPerPage ?? 20,
          emailNotifications: input.emailNotifications ?? true,
          twoFactorEnabled: false,
          encryptionEnabled: input.encryptionEnabled ?? false,
        });
      }

      return { success: true };
    }),
});
