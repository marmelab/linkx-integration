import type { Hono } from "hono";

import { describeRoute, resolver, validator } from "hono-openapi";
import * as zod from "zod";

import { POSSIBLE_COLORS } from "../../domain/game/move.ts";
import { runGame } from "../../domain/game/run-game.ts";
import { largestArea } from "../../domain/state/largest-area.ts";

export function httpGetLargestArea(app: Hono) {
  const stateValidator = zod.object({
    state: zod.string().optional(),
  });
  const responseSchema = zod.object({
    largestArea: zod.object({
      color: zod.literal(POSSIBLE_COLORS),
      path: zod.array(zod.string()).optional(),
    }),
  });

  app.get(
    "/game-state/largest-area",
    describeRoute({
      description:
        "Get the largest area for a given game state. Useful for determining victory when no one can play a legal move anymore.",
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": { schema: resolver(responseSchema) },
          },
        },
      },
    }),
    validator("query", stateValidator),
    (context) => {
      const sanitizedQuery = context.req.valid("query");

      try {
        const game = runGame(sanitizedQuery.state);
        return context.json({ largestArea: largestArea(game.grid) });
      } catch (err: any) {
        return context.json(
          {
            message: err.message,
            additionalContext: err.additionalContext ?? {},
          },
          400,
        );
      }
    },
  );
}
