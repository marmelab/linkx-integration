import type { ViewStyle } from "react-native";
import type { StyleProp } from "react-native";
import type { PressableEvent } from "react-native-gesture-handler";

import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import type { PieceSelection } from "@/model/game";

import { GameModeContext } from "@/context/game-mode-context";
import { RunningGameContext } from "@/context/running-game-context";
import { getPieceKey } from "@/helper/get-piece-key";

import Cell from "./cell";
import PieceCountIndicator from "./piece-count-indicator";

type PieceProps = {
  pieceSelection: PieceSelection;
  onPressOut: (event: PressableEvent) => void;
  selected?: boolean;
  width: number;
  style?: StyleProp<ViewStyle> | undefined;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  disabled?: boolean;
};

export default function Piece({
  pieceSelection,
  onPressOut,
  selected,
  width,
  style,
  contentContainerStyle,
  disabled,
}: PieceProps) {
  const mode = useContext(GameModeContext);
  const game = useContext(RunningGameContext);

  const pieceKey = getPieceKey(pieceSelection.color, pieceSelection.pieceName);
  const pieceModel = game?.mappedPieces[pieceKey];

  if (!pieceModel) {
    console.error(`Unknown piece ${pieceKey}`);
    return <></>;
  }

  const selectedPossibleMatrix = pieceModel.possibleMatrices.find(
    (possibleMatrix) => {
      return (
        possibleMatrix.mirrored.includes(pieceSelection.mirrored) &&
        possibleMatrix.rotations.includes(pieceSelection.selectedRotation)
      );
    },
  );
  const selectedMatrix = selectedPossibleMatrix?.matrix;

  if (!selectedMatrix) {
    console.error(
      `Unknown configuration for piece {piece: ${pieceModel.piece}, rotation: ${pieceSelection.selectedRotation}, mirrored: ${pieceSelection.mirrored} }`,
    );
    return <></>;
  }

  const cellWidth = width / 3;

  const backgroundColor = pieceModel.color === "blue" ? "#F6FBFD" : "#FFF8F8";
  const borderColor = pieceModel.color === "blue" ? "#006596" : "#9C4438";
  const gridAdditionalStyle = selected
    ? {
        backgroundColor,
        borderColor,
        borderWidth: 2,
      }
    : {};

  return (
    <Pressable
      activeOpacity={0.2}
      animationDuration={{ in: 50, out: 150 }}
      disabled={
        disabled ||
        mode === "spectating" ||
        game?.completed ||
        pieceModel.count === 0
      }
      style={[styles.container, style]}
      onPressOut={(event) => onPressOut(event)}
    >
      <View style={[styles.piece, contentContainerStyle]}>
        <View
          style={[
            styles.gridContainer,
            { width, height: width },
            gridAdditionalStyle,
          ]}
          key={`${pieceModel.piece}-${pieceModel.color}:${pieceSelection.selectedRotation}:${pieceSelection.mirrored}`}
        >
          {Array.from({ length: selectedMatrix[0].length }).map(
            (_, reversedY) => {
              const y = selectedMatrix[0].length - 1 - reversedY;
              return (
                <View key={`row-${y}`} style={styles.row}>
                  {Array.from({ length: selectedMatrix.length }).map(
                    (__, x) => {
                      return (
                        <Cell
                          width={cellWidth}
                          cellValue={
                            selectedMatrix[x]?.at(y) === 1
                              ? pieceModel.color
                              : ""
                          }
                          key={`${x}-${y}`}
                        ></Cell>
                      );
                    },
                  )}
                </View>
              );
            },
          )}
        </View>
        <PieceCountIndicator
          key={`${pieceModel.piece}-${pieceModel.color}:${pieceModel.count}`}
          pieceModel={pieceModel}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    borderRadius: 18,
    paddingBottom: 0,
  },
  piece: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  row: {
    flex: 0,
    flexDirection: "row",
  },
  grid: {
    flex: 0,
    marginLeft: 6,
    marginRight: 6,
  },
  gridContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
    boxSizing: "border-box",
  },
  buttonMirror: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#B5BEC8",
    borderColor: "#526172",
  },
});
