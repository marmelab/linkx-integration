import { Host, List, ListItem, Text } from "@expo/ui";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";

import { listGames } from "@/api";

import Game from "./game";

export const RunningGameContext = createContext(null);

export default function GameList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["games"],
    queryFn: listGames,
  });

  const [runningGame, setRunningGame] = useState(null);

  if (isPending) {
    return (
      <Host>
        <Text>Loading elements...</Text>
      </Host>
    );
  }

  if (error) {
    const message = `Could not load current games: ${error.message}`;
    return (
      <Host>
        <Text>{message}</Text>
      </Host>
    );
  }

  if (runningGame) {
    return (
      <Host>
        <RunningGameContext value={runningGame}>
          <Game game={runningGame} />
        </RunningGameContext>
      </Host>
    );
  } else {
    return (
      <Host>
        <List>
          {data.games.map((game) => (
            <ListItem key={game.id} onPress={() => setRunningGame(game)}>
              <Host>
                <Text>{game.id}</Text>
              </Host>
            </ListItem>
          ))}
        </List>
      </Host>
    );
  }
}
