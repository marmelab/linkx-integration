import { getPossibleMoves } from "./get-possibles-moves";
import { runGame } from "./run-game";

describe("get-possible-moves", () => {
  it("should give the 95 possible moves on empty grid", () => {
    const game = runGame();
    expect(getPossibleMoves(game).length).toBe(95);
  });

  // TODO to complete when time allows it
});
