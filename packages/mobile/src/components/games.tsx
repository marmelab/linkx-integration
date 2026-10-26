import { Host, List, ListItem, Row, Text } from "@expo/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { StyleSheet, View } from "react-native";

import { listGames } from "@/api";

import Game from "./game";

export const RunningGameContext = createContext(null);

export default function Games() {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["games"],
    queryFn: listGames,
  });

  const handleRefresh = async () =>
    queryClient.invalidateQueries({ queryKey: ["games"] });

  const [runningGame, setRunningGame] = useState(null);

  if (isPending) {
    return (
      <Host matchContents>
        <Text textStyle={styles.basicText}>Loading elements...</Text>
      </Host>
    );
  }

  if (error) {
    const message = `Could not load current games: ${error.message}`;
    return (
      <Host matchContents>
        <Text textStyle={styles.errorText}>{message}</Text>
      </Host>
    );
  }

  if (runningGame) {
    const id: number = runningGame.id;
    return (
      <View style={styles.container}>
        <Game id={id} />
      </View>
    );
  } else {
    return (
      <Host style={styles.container}>
        <Text textStyle={styles.basicText}>Spectate:</Text>
        <List onRefresh={() => handleRefresh()}>
          {data.games.map((game: any) =>
            GameListElement(game, (gameSelected: any) =>
              setRunningGame(gameSelected),
            ),
          )}
        </List>
      </Host>
    );
  }
}

function GameListElement(game: any, onGameSelection: Function) {
  const versusStr = `${game.firstPlayer.displayName} VS ${game.secondPlayer.displayName}`;
  return (
    <ListItem key={game.id} onPress={() => onGameSelection(game)}>
      <ListItem.Leading>
        <Text>{game.id}</Text>
      </ListItem.Leading>
      <Row spacing={0}>
        <Text>{versusStr}</Text>
      </Row>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  basicText: {
    flex: 1,
    textAlign: "center",
    color: "#333333",
  },
  errorText: {
    color: "#000",
    backgroundColor: "#FEA69A",
    borderWidth: 1,
    borderColor: "#9C4438",
    borderRadius: 5,
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
