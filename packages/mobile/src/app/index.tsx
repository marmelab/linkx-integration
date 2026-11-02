import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GamesList from "@/components/game-list";
import { useCreateLocalGame } from "@/hooks/games/use-create-local-game";
import { primary } from "@/style-constants";

export default function Index() {
  const createGameMutation = useCreateLocalGame();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Linkx</Text>
        {createGameMutation.error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {createGameMutation.error.message}
            </Text>
          </View>
        ) : (
          <View style={styles.noErrorPadding} />
        )}
        <Text style={styles.heading}>New game:</Text>
        <Pressable
          style={styles.newGameButton}
          onPress={() => createGameMutation.mutate({})}
          disabled={createGameMutation.isPending}
        >
          <Text style={styles.basicText}>Start a game</Text>
        </Pressable>

        <GamesList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 12,
    marginLeft: 22,
    marginRight: 22,
    paddingTop: 18,
  },
  title: {
    color: primary[800],
    fontSize: 52,
    textAlign: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333333",
  },
  errorText: {
    color: "#9C4438",
  },
  errorContainer: {
    height: 60,
    backgroundColor: "#FFC8C0",
    borderWidth: 1,
    borderColor: "#9C4438",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  noErrorPadding: {
    height: 60,
  },
  newGameButton: {
    borderWidth: 2,
    borderColor: primary[800],
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    marginBottom: 8,
    borderRadius: 20,
  },
  basicText: {
    textAlign: "center",
    color: primary[800],
    fontSize: 24,
  },
});
