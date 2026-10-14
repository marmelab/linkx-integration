import type readline from "node:readline";

import chalk from "chalk";

import type { Game } from "../domain/game/game.ts";

import { getPossibleMoves } from "../domain/game/get-possibles-moves.ts";
import { gameReducer } from "../domain/game/run-game.ts";
import { parseSingularMove } from "../domain/state/gamestate-parser.ts";
import { largestArea } from "../domain/state/largest-area.ts";
import { displayGame } from "./display-game.ts";

export function playThroughCli(rl: readline.Interface, game: Game) {
  const color =
    game.turnOfPlayer === "blue"
      ? chalk.blueBright(game.turnOfPlayer)
      : chalk.white(game.turnOfPlayer);

  if (game.victory) {
    displayGame(game);
    rl.close();
    return;
  }

  if (getPossibleMoves(game).length === 0) {
    console.log(`Player ${color}: turn skipped due to lack of possible moves.`);
    const skipMove = {
      skipped: true,
      color: game.turnOfPlayer,
    };
    if (game.lastMove?.skipped) {
      console.log("Game ended: both players cannot play legal moves anymore.");
      const victoryByArea = largestArea(game.grid);
      if (victoryByArea) {
        console.log(`Victory of player ${color} !`);
      } else {
        console.log(
          "Draw: both players have the same number of blocks in their biggest area.",
        );
      }
      rl.close();
      return;
    }
    playThroughCli(rl, gameReducer(game, skipMove));
    return;
  }

  rl.question(
    `Player ${color}: Enter a move to play\n` +
      chalk.grey(
        `Syntax: piece [rN with N = number of clockwise quarter turn] [m if mirrored] columnNumber\nExample: 3Lr16 will place a rotated-once 3L piece on column 6.\n`,
      ),
    (answer) => {
      try {
        if (answer.length === 0) {
          throw new Error("You need to indicate a move to play.");
        } else if (/ /.test(answer)) {
          throw new Error(
            "You can only specify one move at a time, without whitespaces.",
          );
        }

        const parsedMove = parseSingularMove(game.turnOfPlayer, answer);

        const updatedGame = gameReducer(game, parsedMove);
        displayGame(updatedGame);
        playThroughCli(rl, updatedGame);
      } catch (err: any) {
        displayGame(game);
        console.log(chalk.red(err.message));
        playThroughCli(rl, game); // Re-starting the turn
      }
    },
  );
}
