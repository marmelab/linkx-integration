import { useQuery } from "@tanstack/react-query";
import {
  BackHandler,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { GameModel } from "@/model/game";

import { showGame } from "@/api";
import { RunningGameContext } from "@/context/running-game-context";

import GameLabel from "./game-label";
import Grid from "./grid";
import PieceCarousel from "./piece-carousel";

export default function Game({
  id,
  onRequestClose,
}: {
  id: number;
  onRequestClose: () => void;
}) {
  const { isPending, error, data } = useQuery({
    queryKey: ["game", id],
    queryFn: () => showGame(id),
    refetchInterval: 1500,
  });
  BackHandler.addEventListener("hardwareBackPress", () => {
    // TODO confirmation when playing
    onRequestClose();
    return true;
  });

  const insets = useSafeAreaInsets();

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
  const width =
    Dimensions.get("screen").width - 20 - insets.left - insets.right;

  const game = data.game as GameModel;
  const gameTitle = `${game.firstPlayer?.displayName ?? "Unknown player"} VS ${game.secondPlayer?.displayName ?? "Unknown player"}`;

  const carouselKey = game.availablePieces.reduce((accumulator, piece) => {
    return accumulator + piece.count;
  }, 0);

  return (
    <RunningGameContext value={game}>
      <View style={styles.game}>
        <View style={[styles.titleContainer, { width }]}>
          <Pressable
            onPress={onRequestClose}
            style={[styles.button, styles.buttonReturn]}
          >
            <Text>Exit</Text>
          </Pressable>
          {!game.victory && <Text style={styles.heading}>{gameTitle}</Text>}
        </View>
        <GameLabel />
        <Grid width={width} />
        <PieceCarousel key={carouselKey} width={width} />
      </View>
    </RunningGameContext>
  );
}

const styles = StyleSheet.create({
  game: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 26,
    flex: 1,
  },
  actions: {
    flex: 1,
    justifyContent: "flex-end",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 0,
    minWidth: 60,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    textAlign: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  buttonReturn: {
    position: "absolute",
    left: 0,
    top: 10,
    borderColor: "#9AA6B5",
    backgroundColor: "#ECEEF1",
  },
  fullPageText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
