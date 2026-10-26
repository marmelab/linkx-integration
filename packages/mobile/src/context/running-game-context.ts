import { createContext } from "react";

import type { GameModel } from "@/model/game";

export const RunningGameContext = createContext<GameModel | undefined>(
  undefined,
);
