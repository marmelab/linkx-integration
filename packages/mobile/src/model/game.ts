import type { Move } from "./move";
import type { Player } from "./player";

export type GameModel = {
  id: number;
  grid: string[][];
  availablePieces: PieceModel[];
  turnOfPlayer: Color;
  victory: string[] | null;
  canPlay: { white: boolean; blue: boolean };
  lastMove?: Move;
  firstPlayer: Player;
  secondPlayer?: Player;
  completed: boolean;
};

export type Color = "white" | "blue";

export type PieceModel = {
  piece: string;
  color: "white" | "blue";
  count: number;
  possibleMatrices: PiecePossibleMatrices[];
};

export type PiecePossibleMatrices = {
  rotations: number[];
  mirrored: boolean[];
  matrix: number[][];
};

export type PieceSelection = {
  pieceModel: PieceModel;
  selectedRotation: number;
  mirrored: boolean;
};
