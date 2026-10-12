import type { Grid } from "../state/grid.ts";
import type { Color, Move, Piece } from "./move.ts";

export type Game = {
  grid: Grid;
  availablePieces: Array<PieceCount>;
  turnOfPlayer: Color;
  lastMove?: Move;
  victory: Victory;
};

export type PieceCount = {
  piece: Piece;
  color: Color;
  count: number;
};

export type Victory =
  | {
      path: string[];
      color: Color;
    }
  | false;

export const GRID_MAX_HEIGHT = 8;
