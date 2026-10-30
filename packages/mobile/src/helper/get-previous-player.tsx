import type { GameModel } from "@/model/game";

export function getPreviousPlayer(game: GameModel) {
  return game.lastMove?.color === "blue" ? game.firstPlayer : game.secondPlayer;
}
