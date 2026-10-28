import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import { GameModeContext } from "@/context/game-mode-context";
import { RunningGameContext } from "@/context/running-game-context";

import Cell from "./cell";

type GridProps = {
  width: number;
  onColumnSelection: (column: number) => void;
  disabled: boolean;
};

export default function Grid({
  width,
  onColumnSelection,
  disabled,
}: GridProps) {
  const game = useContext(RunningGameContext);
  const gameMode = useContext(GameModeContext);
  if (!game) {
    return null;
  }

  const cellWidth = width / game.grid.length;

  return (
    <View style={styles.grid}>
      {Array.from({ length: game.grid[0].length }).map((_, reversedY) => {
        const y = game.grid[0].length - 1 - reversedY;
        return (
          <View key={`row-${y}`} style={styles.row}>
            {Array.from({ length: game.grid.length }).map((__, x) => {
              return (
                <Pressable
                  activeOpacity={0.2}
                  animationDuration={{ in: 50, out: 150 }}
                  disabled={disabled || gameMode === "spectating"}
                  onPress={() => onColumnSelection(x)}
                  key={`${x}.${y}:${game.grid[x][y]}`}
                >
                  <Cell width={cellWidth} cellValue={game.grid[x][y]}></Cell>
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 0,
    marginTop: 18,
  },
  row: {
    flex: 0,
    flexDirection: "row",
  },
});
