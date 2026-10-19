import type { Move } from "../game/move";

import { initGrid, runGame } from "../game/run-game";
import { gridReducer } from "./grid-reducer";
import { largestArea } from "./largest-area";

describe("largest-area", () => {
  const emptyGrid = initGrid();
  it("should detect a draw", () => {
    const firstMove: Move = {
      skipped: false,
      color: "white",
      piece: "3I",
      column: 0,
      mirrored: false,
      rotation: 0,
    };
    const secondMove: Move = {
      skipped: false,
      color: "blue",
      piece: "3I",
      column: 6,
      mirrored: false,
      rotation: 0,
    };

    const gridWithDraw = gridReducer(
      gridReducer(emptyGrid, firstMove),
      secondMove,
    );

    expect(largestArea(emptyGrid)).toBe(null);
    expect(largestArea(gridWithDraw)).toBe(null);
  });

  it("should detect a simple victory", () => {
    const firstMove: Move = {
      skipped: false,
      color: "white",
      piece: "3I",
      column: 0,
      mirrored: false,
      rotation: 1,
    };
    const secondMove: Move = {
      skipped: false,
      color: "blue",
      piece: "2",
      column: 7,
      mirrored: false,
      rotation: 0,
    };

    const gridWithWhiteVictory = gridReducer(
      gridReducer(emptyGrid, firstMove),
      secondMove,
    );

    expect(largestArea(gridWithWhiteVictory)).toEqual({
      color: "white",
      path: ["0.0", "0.1", "0.2"],
    });
  });

  it("should detect the correct path when multiple zones exist", () => {
    const input =
      "3Im4 4Sr12 4Lm7 4Lmr22 4Lm2 1m2 3Lr35 4T2 2mr18 4Tr18 2mr17 2mr15 3Imr14 3Imr13 1m9 4Sm7 1m5 3L8 3Lr28 4Lr16 4Sm5 2r1m5 -- 1m6 -- 3Ir1m2 --";
    const gridWithBlueVictory = runGame(input);

    expect(largestArea(gridWithBlueVictory.grid)).toEqual({
      color: "white",
      path: [
        "1.0",
        "1.1",
        "1.2",
        "2.0",
        "2.1",
        "2.2",
        "3.1",
        "3.2",
        "4.2",
        "4.3",
        "5.3",
        "5.4",
        "5.5",
        "6.3",
        "6.4",
        "6.5",
        "7.3",
        "7.4",
        "7.5",
        "7.6",
        "7.7",
        "8.2",
        "8.3",
        "8.4",
        "8.6",
      ],
    });
  });
});
