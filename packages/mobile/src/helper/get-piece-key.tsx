import type { Color } from "@/model/game";

export function getPieceKey(color: Color, pieceName: string) {
  return `${color}-${pieceName}`;
}
