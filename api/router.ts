import { authRouter } from "./auth-router";
import { vaultItemRouter } from "./routers/vaultItem";
import { vaultFolderRouter } from "./routers/vaultFolder";
import { activityLogRouter } from "./routers/activityLog";
import { userSettingRouter } from "./routers/userSetting";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  vaultItem: vaultItemRouter,
  vaultFolder: vaultFolderRouter,
  activityLog: activityLogRouter,
  userSetting: userSettingRouter,
});

export type AppRouter = typeof appRouter;
