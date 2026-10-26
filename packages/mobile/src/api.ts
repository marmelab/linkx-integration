import type { GameModel } from "./model/game";
import type { Move } from "./model/move";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost";

export async function listGames(): Promise<{ games: GameModel[] }> {
  const response = await fetch(`${apiBaseUrl}/games`);

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return response.json();
}

export async function showGame(id: string): Promise<{ game: GameModel }> {
  const response = await fetch(`${apiBaseUrl}/games/${id}`);

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return response.json();
}

export async function playTurn(gameId: number, move: Move): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/games/${gameId}/play-turn`, {
    method: "PATCH",
    body: JSON.stringify(move),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.text().then();
}
