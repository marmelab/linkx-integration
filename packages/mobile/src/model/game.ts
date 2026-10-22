import type { Player } from "./player";

export type GameModel = {
  id: number;
  grid: string[][];
  availablePieces: PieceModel[];
  turnOfPlayer: "white" | "blue";
  victory: string[] | null;
  canPlay: { white: boolean; blue: boolean };
  firstPlayer: Player;
  secondPlayer: Player;
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
  piece: string;
  color: "white" | "blue";
  selectedRotation: number;
  mirrored: boolean;
};
