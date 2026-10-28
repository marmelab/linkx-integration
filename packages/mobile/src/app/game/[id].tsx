import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
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
  const { isRefetching, isPending, error, data } = useGameById(
    id,
    mode !== "playing-local",
  );

  if (isPending) {
    return (
      <View style={[styles.fullPageText, { alignItems: "center" }]}>
        <MaterialDesignIcons name="loading" size={32} color="#1993D0" />
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
        <View style={styles.container}>
          <GameModeContext value={mode}>
            <RunningGameContext value={data.game}>
              <Game
                key={`game-${id}`}
                disabled={isPending || isRefetching}
                onRequestClose={() => router.back()}
              />
            </RunningGameContext>
          </GameModeContext>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 22,
    marginRight: 22,
  },
  fullPageText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    textAlign: "center",
  },
  errorContainer: {
    height: 50,
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
