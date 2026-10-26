import { useContext } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RunningGameContext } from "@/context/running-game-context";

import GameLabel from "./game-label";
import Grid from "./grid";
import PieceCarousel from "./piece-carousel";

type GameProps = {
  onRequestClose: () => void;
};

export default function Game({ onRequestClose }: GameProps) {
  const game = useContext(RunningGameContext);

  if (!game) {
    return <></>;
  }

  const insets = useSafeAreaInsets();
  const width =
    Dimensions.get("screen").width - 20 - insets.left - insets.right;

  const carouselKey = game.availablePieces.reduce((accumulator, piece) => {
    return accumulator + piece.count;
  }, 0);

  return (
    <View style={styles.game}>
      <View style={[styles.titleContainer, { width }]}>
        <Pressable
          onPress={onRequestClose}
          style={[styles.button, styles.buttonReturn]}
        >
          <Text>Exit</Text>
        </Pressable>
      </View>
      <GameLabel />
      <Grid width={width} />
      <PieceCarousel key={carouselKey} width={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  game: {
    flex: 1,
    alignItems: "center",
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
});
