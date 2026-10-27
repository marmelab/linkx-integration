import { useContext } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { GameModeContext } from "@/context/game-mode-context";
import { RunningGameContext } from "@/context/running-game-context";

import Cell from "./cell";

type GridProps = { width: number; onColumnSelection: (column: number) => void };

export default function Grid({ width, onColumnSelection }: GridProps) {
  const game = useContext(RunningGameContext);
  const gameMode = useContext(GameModeContext);
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
        <TouchableOpacity
          disabled={gameMode === "spectating"}
          onPress={() => onColumnSelection(item.item.x)}
        >
          <Cell width={cellWidth} cellValue={item.item.value}></Cell>
        </TouchableOpacity>
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
    marginBottom: -340,
  },
});
