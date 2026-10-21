import { Host, List, ListItem } from "@expo/ui";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { listGames } from "@/api";

import Game from "./game";

export const RunningGameContext = createContext(null);

export default function Games() {
  const { isPending, error, data } = useQuery({
    queryKey: ["games"],
    queryFn: listGames,
  });

  const [runningGame, setRunningGame] = useState(null);

  if (isPending) {
    return (
      <View>
        <Text style={styles.basicText}>Loading elements...</Text>
      </View>
    );
  }

  if (error) {
    const message = `Could not load current games: ${error.message}`;
    return (
      <View>
        <Text style={styles.basicText}>{message}</Text>
      </View>
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
      <View style={styles.container}>
        <Text>Currently running games:</Text>
        <View style={styles.list}>
          <Host style={styles.list}>
            <List>
              {data.games.map((game: any) => (
                <ListItem key={game.id} onPress={() => setRunningGame(game)}>
                  <View style={styles.listElement}>
                    <Text>{game.id}</Text>
                    <Text>
                      {game.firstPlayer.displayName} VS{" "}
                      {game.secondPlayer.displayName}
                    </Text>
                  </View>
                </ListItem>
              ))}
            </List>
          </Host>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 400,
  },
  basicText: {
    color: "#333333",
  },
  list: {
    flex: 1,
  },
  listElement: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
});
