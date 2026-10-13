import type { Hono } from "hono";

import { describeRoute, resolver, validator } from "hono-openapi";
import * as zod from "zod";

import { getPossibleMoves } from "../../domain/game/get-possibles-moves.ts";
import { POSSIBLE_COLORS, POSSIBLE_PIECES } from "../../domain/game/move.ts";
import { runGame } from "../../domain/game/run-game.ts";

export function httpGetPossibleMoves(app: Hono) {
  const stateValidator = zod.object({
    state: zod.string().optional(),
  });
  const responseSchema = zod.object({
    possibleMoves: zod.array(
      zod.object({
        skipped: zod.boolean(),
        color: zod.literal(POSSIBLE_COLORS),
        piece: zod.literal(POSSIBLE_PIECES).optional(),
        column: zod.number().optional(),
        rotation: zod.number().optional(),
        mirrored: zod.boolean().optional(),
      }),
    ),
  });

  app.get(
    "/game-state/possible-moves",
    describeRoute({
      description:
        "Get possibles moves for the current player of the given game state",
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

      const game = runGame(sanitizedQuery.state);
      return context.json({ possibleMoves: getPossibleMoves(game) });
    },
  );
}
