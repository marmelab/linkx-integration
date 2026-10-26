import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Game from "@/components/game";
import { GameModeContext, type GameMode } from "@/context/game-mode-context";
import { RunningGameContext } from "@/context/running-game-context";
import { useGameById } from "@/hooks/use-game-by-id";

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
      <View style={styles.fullPageText}>
        <Text>Error : couldn't fetch game.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <GameModeContext value={mode}>
          <RunningGameContext value={data?.game}>
            <Game key={`game-${id}`} onRequestClose={() => router.back()} />
          </RunningGameContext>
        </GameModeContext>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullPageText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
