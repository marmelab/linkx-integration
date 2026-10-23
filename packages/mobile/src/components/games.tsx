import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { listGames } from "@/api";

import Game from "./game";
import GameListElement from "./game-list-element";

export default function Games() {
  const { isPending, error, data } = useQuery({
    queryKey: ["games"],
    queryFn: listGames,
    refetchInterval: 1000,
  });

  const [runningGameId, setRunningGameId] = useState<number | null>(null);

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

  if (runningGameId) {
    console.log(runningGameId);
    return (
      <View style={styles.container}>
        <Game
          key={`game-${runningGameId}`}
          onRequestClose={() => setRunningGameId(null)}
          id={runningGameId}
        />
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
          renderItem={(game) => (
            <GameListElement
              game={game.item}
              onSelection={(id) => setRunningGameId(id)}
            />
          )}
        ></FlatList>
      </View>
    );
  }
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
});
