import type { Color } from "./game";

export type Move = {
  skipped: boolean;
  color: Color;
  piece: string | undefined;
  column: number | undefined;
  rotation: number | undefined;
  mirrored: boolean | undefined;
};
