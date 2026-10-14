import type { Hono } from "hono";

export function httpGetHealth(app: Hono) {
  app.get("/health", (context) => {
    return context.text("Alive !");
  });
}
