import { Column, Host, Text } from "@expo/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { showGame } from "@/api";

export default function Game(param: any) {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["game"],
    queryFn: () => showGame(param.id),
  });

  const insets = useSafeAreaInsets();
  const screenWidth =
    Dimensions.get("screen").width - 20 - insets.left - insets.right;
  const screenHeight =
    Dimensions.get("screen").height - 20 - insets.bottom - insets.top;

  useEffect(() => {
    const timer = setInterval(
      () => queryClient.invalidateQueries({ queryKey: ["game"] }),
      1,
    );
    return () => clearInterval(timer);
  }, []);

  if (isPending) {
    return (
      <Host matchContents>
        <Text>Loading game...</Text>
      </Host>
    );
  }

  if (error) {
    return (
      <Host matchContents>
        <Text>Error : couldn't fetch game.</Text>
      </Host>
    );
  }

  const game = data.game;
  const gameTitle = `${game.firstPlayer?.displayName ?? "Unknown player"} VS ${game.secondPlayer?.displayName ?? "Unknown player"}`;
  return (
    <Host style={{ ...styles.game, width: screenWidth, height: screenHeight }}>
      <Column style={{ width: screenWidth, height: screenHeight }}>
        <Text>{gameTitle}</Text>
        {GameLabel(game)}
        {Grid(game.grid)}
      </Column>
    </Host>
  );
}

function GameLabel(game: any) {
  return <Text>Game in progress...</Text>; // TODO
}

function Grid(grid: string[][]) {
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

  return (
    <FlatList
      data={cells}
      style={styles.grid}
      renderItem={(item: any) => Cell(item.item.value)}
      keyExtractor={(item) => `${item.x}.${item.y}`}
      numColumns={9}
    />
  );
}

function Cell(cellValue: string) {
  switch (cellValue) {
    case "white":
    case "whiteLastMove":
      return <View style={styles.cellWhite}></View>;
    case "blue":
    case "blueLastMove":
      return <View style={styles.cellBlue}></View>;
    case ".":
    default:
      return <View style={styles.emptyCell}></View>;
  }
}

const borderColor = "#333";
const styles = StyleSheet.create({
  game: {
    flex: 1,
  },
  grid: {
    flex: 1,
  },
  cellWhite: {
    flex: 1,
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#9C4438",
  },
  cellBlue: {
    flex: 1,
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#006596",
  },
  emptyCell: {
    flex: 1,
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});
