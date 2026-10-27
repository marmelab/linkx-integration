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

import Cell from "./cell";
import PieceCountIndicator from "./piece-count-indicator";

type PieceProps = {
  pieceSelection: PieceSelection;
  onPressOut: (event: PressableEvent) => void;
  onMirrorPiece?: (event: PressableEvent) => void;
  width: number;
  style?: StyleProp<ViewStyle> | undefined;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  disabled?: boolean;
};

export default function Piece({
  pieceSelection,
  onPressOut,
  onMirrorPiece,
  width,
  style,
  contentContainerStyle,
  disabled,
}: PieceProps) {
  const mode = useContext(GameModeContext);
  const game = useContext(RunningGameContext);

  const pieceModel = game?.availablePieces.find(
    (piece) =>
      piece.color === pieceSelection.color &&
      piece.piece === pieceSelection.pieceName,
  );

  if (!pieceModel) {
    console.error(
      `Unknown piece ${pieceSelection.color}-${pieceSelection.pieceName}`,
    );
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
  const pieceAdditionalStyle = pieceSelection.selected
    ? {
        height: width + (mode && mode !== "spectating" ? 120 : 50),
        backgroundColor,
        borderColor,
        borderWidth: 2,
      }
    : {
        height: width + (mode && mode !== "spectating" ? 120 : 50),
      };

  const key = `${pieceModel.piece}-${pieceModel.color}:${pieceSelection.selectedRotation}:${pieceSelection.mirrored}:${pieceModel.count}`;
  const countKey = `${pieceModel.piece}-${pieceModel.color}:${pieceModel.count}`;
  return (
    <Pressable
      key={key}
      disabled={disabled || mode === "spectating" || game?.completed}
      style={[styles.container, pieceAdditionalStyle, style]}
      onPressOut={(event) => onPressOut(event)}
    >
      <View style={[styles.piece, contentContainerStyle]}>
        <PieceCountIndicator key={countKey} pieceModel={pieceModel} />
        <FlatList
          key={key}
          scrollEnabled={false}
          data={cells}
          style={[styles.grid, { width, height: width }]}
          contentContainerStyle={styles.gridContainer}
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
