import type { Grid } from "../state/grid.ts";
import type { Color, Move, Piece } from "./move.ts";

export type Game = {
  grid: Grid;
  availablePieces: Array<PieceCount>;
  turnOfPlayer: Color;
  lastMove?: Move;
  victory: string[] | null;
};

export type PieceCount = {
  piece: Piece;
  color: Color;
  count: number;
};

export const GRID_MAX_HEIGHT = 8;
