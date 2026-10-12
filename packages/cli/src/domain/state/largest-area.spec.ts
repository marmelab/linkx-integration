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

    expect(largestArea(emptyGrid)).toBe(false);
    expect(largestArea(gridWithDraw)).toBe(false);
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
    const input = "W 3IR11 4Tr22 15 3Lr25 14 4LR38";
    const gridWithBlueVictory = runGame(input);

    expect(largestArea(gridWithBlueVictory.grid)).toEqual({
      color: "blue",
      path: ["1.0", "2.0", "2.1", "3.0", "4.1", "5.0", "5.1"],
    });
  });
});
