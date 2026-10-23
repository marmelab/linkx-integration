import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { GameModel } from "@/model/game";

import { listGames } from "@/api";

import Game from "./game";

export default function Games() {
  const { isPending, error, data } = useQuery({
    queryKey: ["games"],
    queryFn: listGames,
    refetchInterval: 1000,
  });

  const [runningGame, setRunningGame] = useState<GameModel | null>(null);

  if (isPending) {
    return (
      <View style={styles.fullPageText}>
        <Text style={styles.basicText}>Loading elements...</Text>
      </View>
    );
  }

  if (error) {
    const message = `Could not load current games: ${error.message}`;
    return (
      <View style={styles.fullPageText}>
        <Text style={styles.errorText}>{message}</Text>
      </View>
    );
  }

  if (runningGame) {
    const id: number = runningGame.id;
    return (
      <View style={styles.container}>
        <Game onRequestClose={() => setRunningGame(null)} id={id} />
      </View>
    );
  } else if (data.games.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.basicText, styles.heading]}>Spectate:</Text>
        <Text style={[styles.basicText, styles.subHeading]}>
          There is no one currently playing.
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={[styles.basicText, styles.heading]}>Spectate:</Text>
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ justifyContent: "flex-start" }}
          data={data.games}
          renderItem={(game) =>
            GameListElement(game.item, (gameSelected: any) =>
              setRunningGame(gameSelected),
            )
          }
        ></FlatList>
      </View>
    );
  }
}

function GameListElement(game: any, onGameSelection: Function) {
  const versusStr = `${game.firstPlayer.displayName} VS ${game.secondPlayer.displayName}`;
  return (
    <TouchableOpacity key={game.id} onPress={() => onGameSelection(game)}>
      <View style={styles.listElement}>
        <Text style={styles.basicText}>{versusStr}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullPageText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeading: {
    textAlign: "center",
    fontSize: 20,
    color: "#666",
  },
  basicText: {
    textAlign: "center",
    color: "#333333",
    fontSize: 24,
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
    flexDirection: "row",
    backgroundColor: "#D0D5DC",
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    marginLeft: 22,
    marginRight: 22,
    marginBottom: 8,
    borderRadius: 12,
  },
});
