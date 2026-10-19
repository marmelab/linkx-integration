import type { Hono } from "hono";

import { openAPIRouteHandler } from "hono-openapi";

export function httpGetOpenApi(app: Hono) {
  app.get(
    "/",
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: "Linkx API",
          version: "1.0.0",
          description: "API for the business logic of the linkx game",
        },
        servers: [
          {
            url: process.env.BASE_URL ?? "http://localhost:3005",
            description: "Local Server",
          },
        ],
      },
    }),
  );
}
