import { readFileSync } from "node:fs";
import readline from "node:readline";

import type { CommandArguments } from "./cli/get-arguments.ts";

import { displayGame } from "./cli/display-game.ts";
import { getArguments } from "./cli/get-arguments.ts";
import { playThroughCli } from "./cli/play-through-cli.ts";
import { runGame } from "./domain/game/run-game.ts";
import { runHttpServer } from "./http/run-http-server.ts";

const commandArgs = getArguments();

if (commandArgs.isServer) {
  runHttpServer();
} else {
  startCliGame(commandArgs);
}

function startCliGame(commandArgs: CommandArguments) {
  let fileContent = "";
  if (commandArgs.inputPath) {
    try {
      fileContent = readFileSync(commandArgs.inputPath, "utf8");
    } catch (err) {
      console.error("Couldn't read file. " + err);
    }
  }
  try {
    let game = runGame(fileContent);
    displayGame(game);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    playThroughCli(rl, game);
  } catch (err: any) {
    console.error(
      `The file given contains the following problem :\n${err.message}`,
    );
  }
}
