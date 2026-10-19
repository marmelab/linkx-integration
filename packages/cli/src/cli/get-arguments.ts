import path from "node:path";
import { argv } from "node:process";

export type CommandArguments = {
  inputPath?: string;
};

export function getArguments(): CommandArguments {
  return argv.reduce((args: CommandArguments, currentArg) => {
    if (currentArg.startsWith("--file=")) {
      const inputPartialPath = currentArg.substring(7);
      if (inputPartialPath.startsWith("/") || inputPartialPath.length == 0) {
        return {
          inputPath: inputPartialPath,
        };
      } else {
        return {
          inputPath: path.join(process.cwd(), inputPartialPath),
        };
      }
    }

    return args;
  }, {} satisfies CommandArguments);
}
