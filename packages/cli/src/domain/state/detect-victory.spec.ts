import { runGame } from "../game/run-game";

describe("detect-victory", () => {
  it("should not detect victory when the pieces are not connected", () => {
    const input = "3I1 4L4 3I7 11 4Tr14 11 16";
    const game = runGame(input);

    expect(game.victory).toBe(false);
  });

  it("should detect a simple victory", () => {
    const input = "3I1 11 4L4 11 3I7";
    const game = runGame(input);

    expect(game.victory).toStrictEqual([
      "0.0",
      "1.0",
      "2.0",
      "3.0",
      "4.0",
      "5.0",
      "6.0",
      "7.0",
      "8.0",
    ]);
  });

  it("should detect a complex victory", () => {
    const input =
      "2r11 12 3Lr22 4L4 14 3I1 3L2 4Tr13 4TR33 3Ir15 3Ir16 28 4Lr2m7 11 2r15";
    const game = runGame(input);

    expect(game.victory).toStrictEqual([
      "0.0",
      "1.1",
      "2.1",
      "3.2",
      "2.3",
      "1.4",
      "2.5",
      "3.6",
      "4.5",
      "4.4",
      "5.3",
      "5.2",
      "6.1",
      "7.1",
      "8.1",
    ]);
  });
});
