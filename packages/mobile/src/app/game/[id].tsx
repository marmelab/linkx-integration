import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import Game from "@/components/game";
import { GameModeContext, type GameMode } from "@/context/game-mode-context";
import { RunningGameContext } from "@/context/running-game-context";
import { useGameById } from "@/hooks/games/use-game-by-id";

type GameRouteSearchParams = {
  id: string;
  mode: GameMode;
};

export default function GameRoute() {
  const { id, mode } = useLocalSearchParams<GameRouteSearchParams>();
  const { isPending, error, data } = useGameById(id);

  if (isPending) {
    return (
      <View style={styles.fullPageText}>
        <Text>Loading game...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullPageText}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error : could not fetch game.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View style={{ flex: 1 }}>
          <GameModeContext value={mode}>
            <RunningGameContext value={data?.game}>
              <Game key={`game-${id}`} onRequestClose={() => router.back()} />
            </RunningGameContext>
          </GameModeContext>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullPageText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    textAlign: "center",
  },
  errorContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE9E6",
    borderWidth: 1,
    borderColor: "#9C4438",
    borderRadius: 5,
  },
  errorText: {
    color: "#9C4438",
    fontSize: 22,
  },
});
