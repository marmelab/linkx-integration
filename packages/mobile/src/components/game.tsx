import { useQuery } from "@tanstack/react-query";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { GameModel } from "@/model/game";

import { showGame } from "@/api";
import { RunningGameContext } from "@/context/running-game-context";

import Cell from "./cell";
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
        {GameLabel(game)}
        {Grid(width, game.grid)}
        <PieceCarousel
          key={carouselKey}
          width={width}
          availablePieces={game.availablePieces}
        ></PieceCarousel>
      </View>
    </RunningGameContext>
  );
}

function GameLabel(game: GameModel) {
  if (game.victory && game.lastMove?.color === "blue") {
    return (
      <Text style={[styles.heading, { flex: 0 }]}>
        Victory of {game.firstPlayer.displayName} !
      </Text>
    );
  } else if (game.victory) {
    return (
      <Text style={[styles.heading, { flex: 0 }]}>
        Victory of {game.secondPlayer?.displayName} !
      </Text>
    );
  } else if (game.completed) {
    return <Text style={styles.heading}>It's a draw !</Text>;
  } else if (game.turnOfPlayer === "blue") {
    return (
      <Text style={styles.subHeading}>
        Turn of{" "}
        <Text style={styles.textBlue}>{game.firstPlayer.displayName}...</Text>
      </Text>
    );
  } else if (!game.secondPlayer) {
    return (
      <Text style={styles.subHeading}>
        Waiting for a second player to join...
      </Text>
    );
  } else {
    return (
      <Text style={styles.subHeading}>
        Turn of{" "}
        <Text style={styles.textWhite}>
          {game.secondPlayer?.displayName}...
        </Text>
      </Text>
    );
  }
}

function Grid(width: number, grid: string[][]) {
  const cells = [];

  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x <= grid.length - 1; x++) {
      cells.push({
        value: grid[x][y],
        x: x,
        y: y,
      });
    }
  }

  const cellWidth = width / grid.length;

  return (
    <FlatList
      data={cells}
      style={{ ...styles.grid, width }}
      renderItem={(item) => (
        <Cell width={cellWidth} cellValue={item.item.value}></Cell>
      )}
      keyExtractor={(item) => `${item.x}.${item.y}:${item.value}`}
      numColumns={9}
    />
  );
}

const styles = StyleSheet.create({
  game: {
    flex: 1,
    alignItems: "center",
  },
  grid: {
    flex: 0,
    marginTop: 18,
    marginBottom: -250,
  },
  heading: {
    textAlign: "center",
    fontSize: 26,
    flex: 1,
  },
  subHeading: {
    textAlign: "center",
    fontSize: 20,
    color: "#666",
  },
  textBlue: {
    color: "#006596",
  },
  textWhite: {
    color: "#9C4438",
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
