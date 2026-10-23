import { useContext } from "react";
import { FlatList, StyleSheet } from "react-native";

import { RunningGameContext } from "@/context/running-game-context";

import Cell from "./cell";

export default function Grid({ width }: { width: number }) {
  const game = useContext(RunningGameContext);
  if (!game) {
    return <></>;
  }

  const cells = [];

  for (let y = game.grid.length - 1; y >= 0; y--) {
    for (let x = 0; x <= game.grid.length - 1; x++) {
      cells.push({
        value: game.grid[x][y],
        x: x,
        y: y,
      });
    }
  }

  const cellWidth = width / game.grid.length;

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
  grid: {
    flex: 0,
    marginTop: 18,
    marginBottom: -250,
  },
});
