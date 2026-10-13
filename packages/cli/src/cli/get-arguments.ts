import path from "node:path";
import { argv } from "node:process";

export type CommandArguments = {
  isServer: boolean;
  inputPath?: string;
};

export function getArguments(): CommandArguments {
  return argv.reduce(
    (args: CommandArguments, currentArg) => {
      console.log(currentArg);
      if (currentArg.startsWith("--file=")) {
        const inputPartialPath = currentArg.substring(7);
        if (inputPartialPath.startsWith("/") || inputPartialPath.length == 0) {
          return {
            isServer: false,
            inputPath: inputPartialPath,
          };
        } else {
          return {
            isServer: false,
            inputPath: path.join(process.cwd(), inputPartialPath),
          };
        }
      }

      return args;
    },
    { isServer: true } satisfies CommandArguments,
  );
}
