import { serve } from "@hono/node-server";
import { Hono } from "hono";

export function runHttpServer() {
  const app = new Hono();

  app.get("/", (c) => c.text("Hello Node.js!"));

  // Graceful shutdown
  const server = serve({
    fetch: app.fetch,
    port: 3000,
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
