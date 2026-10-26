import type { GameModel } from "./model/game";
import type { Move } from "./model/move";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost";
const BASE_HEADERS = {
  Accept: "application/json",
  "Content-type": "application/json",
};

export async function listGames(): Promise<{ games: GameModel[] }> {
  const response = await fetch(`${apiBaseUrl}/games`, {
    headers: BASE_HEADERS,
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return response.json();
}

export async function showGame(id: string): Promise<{ game: GameModel }> {
  const response = await fetch(`${apiBaseUrl}/games/${id}`, {
    headers: BASE_HEADERS,
  });

  if (!response.ok) {
    const body = await response.json();
    console.error(body);
    throw new Error(body.message);
  }
  return response.json();
}

export async function playTurn(gameId: number, move: Move): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/games/${gameId}/play-turn`, {
    method: "PATCH",
    body: JSON.stringify(move),
    headers: BASE_HEADERS,
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.text().then();
}

export type GameCreationOptions = {
  local: boolean;
};
export async function createGame(
  options: GameCreationOptions,
): Promise<{ id: number }> {
  const response = await fetch(`${apiBaseUrl}/games`, {
    method: "POST",
    body: JSON.stringify({ ...options }),
    headers: BASE_HEADERS,
  });

  if (!response.ok) {
    const body = await response.json();
    console.error(body);
    throw new Error(body.message ? body.message : body.detail);
  }

  return response.json();
}
