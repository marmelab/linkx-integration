import { useContext } from "react";
import { FlatList, StyleSheet } from "react-native";

import { RunningGameContext } from "@/context/running-game-context";

import Cell from "./cell";

type GridProps = { width: number };

export default function Grid({ width }: GridProps) {
  const game = useContext(RunningGameContext);
  if (!game) {
    return <></>;
  }
  const cells = gridToCells(game.grid);

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

function gridToCells(grid: string[][]) {
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

  return cells;
}

const styles = StyleSheet.create({
  grid: {
    flex: 0,
    marginTop: 18,
    marginBottom: -250,
  },
});
