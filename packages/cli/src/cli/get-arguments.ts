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
            ...args,
            inputPath: inputPartialPath,
          };
        } else {
          return {
            ...args,
            inputPath: path.join(process.cwd(), inputPartialPath),
          };
        }
      } else if (
        currentArg.startsWith("--mode=") &&
        currentArg.substring(7) === "server"
      ) {
        return {
          ...args,
          isServer: true,
        };
      }

      return args;
    },
    { isServer: false } satisfies CommandArguments,
  );
}
