const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost";

export async function listGames() {
  const response = await fetch(`${apiBaseUrl}/games`);

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return response.json();
}

export async function showGame(id: number) {
  const response = await fetch(`${apiBaseUrl}/games/${id}`);

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return response.json();
}
