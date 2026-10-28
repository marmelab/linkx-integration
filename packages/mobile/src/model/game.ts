import type { Move } from "./move";
import type { Player } from "./player";

export type GameModel = {
  id: number;
  grid: string[][];
  availablePieces: PieceModel[];
  mappedPieces: { [key: string]: PieceModel };
  turnOfPlayer: Color;
  victory: string[] | null;
  canPlay: { white: boolean; blue: boolean };
  lastMove?: Move;
  firstPlayer: Player;
  secondPlayer?: Player;
  completed: boolean;
  local: boolean;
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

export type MultiPieceSelection = {
  selectedKey?: string;
  pieces: { [key: string]: PieceSelection };
};

export type PieceSelection = {
  pieceName: string;
  color: Color;
  selectedRotation: number;
  mirrored: boolean;
};
