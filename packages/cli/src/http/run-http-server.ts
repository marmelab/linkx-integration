import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { routes } from "./route/routes.ts";

export function runHttpServer() {
  const app = new Hono();

  routes(app);

  const server = serve({
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3000),
  });

  // graceful shutdown
  process.on("SIGINT", () => {
    server.close();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    server.close((err: any) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  });
}
