export type Game = {
  grid: string[][];
  availablePieces: PieceCount[];
  turnOfPlayer: Color;
  lastMove?: Move;
  victory: string[] | null;
};


export type PieceCount = {
  piece: string;
  color: "white ";
  count: number;
  matrix: 
};