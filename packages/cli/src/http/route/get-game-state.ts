import type { Hono } from "hono";

import { describeRoute, resolver, validator } from "hono-openapi";
import * as zod from "zod";

import { GRID_MAX_HEIGHT, type Game } from "../../domain/game/game.ts";
import { POSSIBLE_COLORS, POSSIBLE_PIECES } from "../../domain/game/move.ts";
import { runGame } from "../../domain/game/run-game.ts";

export function httpGetGameState(app: Hono) {
  const requestSchema = zod.object({
    state: zod.string().optional(),
  });
  const responseSchema = zod.object({
    gameState: zod.object({
      grid: zod.array(zod.array(zod.string())),
      availablePieces: zod.array(
        zod.object({
          piece: zod.literal(POSSIBLE_PIECES),
          color: zod.literal(POSSIBLE_COLORS),
          count: zod.number(),
        }),
      ),
      turnOfPlayer: zod.literal(POSSIBLE_COLORS),
      lastMove: zod.object({
        skipped: zod.boolean(),
        color: zod.literal(POSSIBLE_COLORS),
        piece: zod.literal(POSSIBLE_PIECES).optional(),
        column: zod.number().optional(),
        rotation: zod.number().optional(),
        mirrored: zod.boolean().optional(),
      }),
      victory: zod.array(zod.string()),
    }),
  });

  app.get(
    "/game-state",
    describeRoute({
      description: "Get the state of the game based on a string of moves",
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": { schema: resolver(responseSchema) },
          },
        },
      },
    }),
    validator("query", requestSchema),
    (context) => {
      const sanitizedQuery = context.req.valid("query");

      try {
        const game = rotateGridInNaturalOrder(runGame(sanitizedQuery.state));
        return context.json({ gameState: game });
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

function rotateGridInNaturalOrder(game: Game) {
  const rotatedGrid: string[][] = game.grid.map((column) =>
    Array.from({ length: column.length }),
  );

  game.grid.forEach((column, gridX) => {
    column.forEach((cell, gridY) => {
      const modifiedX = GRID_MAX_HEIGHT - gridY;
      const modifiedY = gridX;

      if (rotatedGrid[modifiedX]) {
        rotatedGrid[modifiedX][modifiedY] = cell;
      }
    });
  });

  return {
    ...game,
    grid: rotatedGrid,
  } satisfies Game;
}
