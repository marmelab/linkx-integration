import type { GameModel } from "./model/game";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost";

export async function listGames(): Promise<{ games: GameModel[] }> {
  const response = await fetch(`${apiBaseUrl}/games`);

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return response.json().then((data) => data.games);
}

export async function showGame(id: number): Promise<{ game: GameModel }> {
  const response = await fetch(`${apiBaseUrl}/games/${id}`);

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return response.json().then((data) => data.game);
}
