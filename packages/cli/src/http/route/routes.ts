import type { Hono } from "hono";

import { cors } from "hono/cors";

import { httpGetGameState } from "./get-game-state.ts";
import { httpGetHealth } from "./get-health.ts";
import { httpGetOpenApi } from "./get-openapi.ts";
import { httpGetPossibleMoves } from "./get-possible-moves.ts";
import { httpGetPiecePossibleRotations } from "./get-possible-rotations.ts";

export function routes(app: Hono) {
  app.use(
    "/*",
    cors({
      origin: [
        "http://localhost:8080",
        "http://localhost:80",
        "https://localhost:443",
      ],
    }),
  );

  httpGetHealth(app);
  httpGetOpenApi(app);
  httpGetGameState(app);
  httpGetPossibleMoves(app);
  httpGetPiecePossibleRotations(app);
}
