import type { Hono } from "hono";

import { describeRoute, resolver, validator } from "hono-openapi";
import * as zod from "zod";

import { POSSIBLE_PIECES, type Piece } from "../../domain/game/move.ts";
import { getPossibleShapesForPiece } from "../../domain/game/piece-shape-from-move.ts";

export function httpGetPiecePossibleRotations(app: Hono) {
  const pieceValidator = zod.object({
    piece: zod.literal(POSSIBLE_PIECES),
  });
  const responseSchema = zod.object({
    possibleRotations: zod.array(
      zod.object({
        rotations: zod.array(zod.number()),
        mirrored: zod.array(zod.number()),
      }),
    ),
  });

  app.get(
    "/pieces/:piece/rotations",
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
    validator("query", pieceValidator),
    (context) => {
      const sanitizedQuery = context.req.valid("query");

      const possibleRotations = getPossibleShapesForPiece(
        sanitizedQuery.piece as Piece,
      ).map((pieceShape) => ({
        rotations: pieceShape.rotations,
        mirrored: pieceShape.mirrored,
      }));

      return context.json({ possibleRotations: possibleRotations });
    },
  );
}
