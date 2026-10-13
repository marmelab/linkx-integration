export type Move = {
  skipped: boolean;
  color: Color;
  piece?: Piece;
  column?: number;
  rotation?: Rotation;
  mirrored?: boolean;
};

export type Color = "white" | "blue";
export type Piece = "1" | "2" | "3I" | "3L" | "4S" | "4T" | "4L";
export type Rotation = 0 | 1 | 2 | 3;

export const POSSIBLE_PIECES = ["1", "2", "3I", "3L", "4S", "4T", "4L"];
export const POSSIBLE_COLORS = ["white", "blue"];
