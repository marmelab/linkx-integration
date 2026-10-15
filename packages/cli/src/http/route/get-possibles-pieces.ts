import type { Hono } from "hono";

import { describeRoute, resolver } from "hono-openapi";
import * as zod from "zod";

import { getPossiblesPieces } from "../../domain/game/piece-shape-from-move.ts";

export function httpGetPiecePossiblePieces(app: Hono) {
  const responseSchema = zod.object({
    possiblePieces: zod.array(
      zod.object({
        piece: zod.string(),
        possiblesMatrices: zod.object({
          rotations: zod.array(zod.number()),
          mirrored: zod.array(zod.number()),
          matrix: zod.array(zod.array(zod.number())),
        }),
      }),
    ),
  });

  app.get(
    "/pieces",
    describeRoute({
      description:
        "Get existing rotations and mirrorred state for the given piece.",
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": { schema: resolver(responseSchema) },
          },
        },
      },
    }),
    (context) => {
      const possiblePieces = getPossiblesPieces();

      return context.json({ possiblePieces: possiblePieces });
    },
  );
}
