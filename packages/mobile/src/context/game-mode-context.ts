import { createContext } from "react";

export type GameMode = "spectating" | "playing-local"; // TODO add online play in a later ticket

export const GameModeContext = createContext<GameMode>("spectating");
