import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GamesList from "@/components/game-list";
import { useCreateLocalGame } from "@/hooks/games/use-create-local-game";

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
        <Text style={styles.heading}>Start a game:</Text>
        <Pressable
          style={styles.newGameButton}
          onPress={() => createGameMutation.mutate({})}
          disabled={createGameMutation.isPending}
        >
          <MaterialDesignIcons
            name={createGameMutation.isPending ? "loading" : "plus"}
            color={"#2C6C2F"}
            size={50}
          />
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
    color: "#005179",
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
    borderColor: "#2C6C2F",
    backgroundColor: "#D9F5DA",
    borderWidth: 3,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 38,
    paddingBottom: 38,
  },
});
