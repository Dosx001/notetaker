// src/server/router/index.ts
import { t } from "server/trpc/utils";

import { noteRouter } from "./note";

export const appRouter = t.router({
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
