import type { ViewStyle } from "react-native";
import type { StyleProp } from "react-native";
import type { PressableEvent } from "react-native-gesture-handler";

import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons/static";
import { useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import type { Color, PieceSelection } from "@/model/game";

import { GameModeContext } from "@/context/game-mode-context";
import { RunningGameContext } from "@/context/running-game-context";
import { getPieceKey } from "@/helper/get-piece-key";

import Cell from "./cell";
import PieceCountIndicator from "./piece-count-indicator";

type PieceProps = {
  pieceSelection: PieceSelection;
  onPressOut: (event: PressableEvent) => void;
  selected: boolean;
  onMirrorPiece?: (event: PressableEvent) => void;
  width: number;
  style?: StyleProp<ViewStyle> | undefined;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  disabled?: boolean;
};

export default function Piece({
  pieceSelection,
  onPressOut,
  selected,
  onMirrorPiece,
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

  const cells = formatMatrixForFlexWrap(selectedMatrix, pieceModel.color);

  const cellWidth = width / 3;
  const canBeMirrored = selectedPossibleMatrix.mirrored.length === 1;

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
      disabled={disabled || mode === "spectating" || game?.completed}
      style={[
        styles.container,
        {
          height: width + (mode && mode !== "spectating" ? 120 : 50),
        },
        style,
      ]}
      onPressOut={(event) => onPressOut(event)}
    >
      <View style={[styles.piece, contentContainerStyle]}>
        <PieceCountIndicator
          key={`${pieceModel.piece}-${pieceModel.color}:${pieceModel.count}`}
          pieceModel={pieceModel}
        />
        <FlatList
          key={`${pieceModel.piece}-${pieceModel.color}:${pieceSelection.selectedRotation}:${pieceSelection.mirrored}`}
          scrollEnabled={false}
          data={cells}
          style={[styles.grid, { width, height: width }, gridAdditionalStyle]}
          contentContainerStyle={[styles.gridContainer]}
          renderItem={(item) => (
            <Cell width={cellWidth} cellValue={item.item.color}></Cell>
          )}
          keyExtractor={(item) => `${item.x}.${item.y}`}
          numColumns={selectedMatrix.length}
        />
        {canBeMirrored && mode && mode !== "spectating" && !game?.completed && (
          <Pressable
            disabled={disabled}
            onPress={(event) => {
              if (onMirrorPiece) {
                onMirrorPiece(event);
              }
            }}
            style={[styles.buttonMirror, { width }]}
          >
            <MaterialDesignIcons name="mirror" size={24} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

function formatMatrixForFlexWrap(matrix: number[][], color: Color) {
  const cells = [];
  for (let y = matrix[0].length - 1; y >= 0; y--) {
    for (let x = 0; x <= matrix.length - 1; x++) {
      if (matrix[x] && matrix[x][y]) {
        cells.push({
          color,
          x,
          y,
        });
      } else {
        cells.push({
          color: "",
          x,
          y,
        });
      }
    }
  }
  return cells;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 6,
    paddingBottom: 0,
  },
  piece: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  grid: {
    flex: 0,
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonMirror: {
    minHeight: 44,
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#B5BEC8",
    borderColor: "#526172",
  },
});
