import type { GestureResponderEvent, ViewStyle } from "react-native";
import type { StyleProp } from "react-native";

import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import type { PieceSelection } from "@/model/game";

import Cell from "./cell";
import PieceCountIndicator from "./piece-count-indicator";

export default function Piece({
  pieceSelection,
  onPress,
  width,
  style,
}: {
  pieceSelection: PieceSelection;
  onPress: (event: GestureResponderEvent) => void;
  width: number;
  style?: StyleProp<ViewStyle> | undefined;
}) {
  const cells = [];

  const selectedMatrix = pieceSelection.pieceModel.possibleMatrices.find(
    (possibleMatrix) => {
      return (
        possibleMatrix.mirrored.includes(pieceSelection.mirrored) &&
        possibleMatrix.rotations.includes(pieceSelection.selectedRotation)
      );
    },
  )?.matrix;

  if (!selectedMatrix) {
    throw new Error(
      `Unknown configuration for piece {piece: ${pieceSelection.pieceModel.piece}, rotation: ${pieceSelection.selectedRotation}, mirrored: ${pieceSelection.mirrored} }`,
    );
  }

  for (let y = selectedMatrix[0].length - 1; y >= 0; y--) {
    for (let x = 0; x <= selectedMatrix.length - 1; x++) {
      if (selectedMatrix[x] && selectedMatrix[x][y]) {
        cells.push({
          color: pieceSelection.pieceModel.color,
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

  const cellWidth = width / 3;
  const key = `${pieceSelection.pieceModel.piece}-${pieceSelection.pieceModel.color}`;
  return (
    <TouchableOpacity
      key={key}
      disabled={true} // TODO change on ticket about playing
      onPressOut={(event) => onPress(event)}
    >
      <View style={[styles.piece, style]}>
        <PieceCountIndicator
          color={pieceSelection.pieceModel.color}
          count={pieceSelection.pieceModel.count}
        />
        <FlatList
          scrollEnabled={false}
          data={cells}
          style={styles.grid}
          renderItem={(item) => (
            <Cell width={cellWidth} cellValue={item.item.color}></Cell>
          )}
          keyExtractor={(item) => `${item.x}.${item.y}`}
          numColumns={selectedMatrix.length}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  piece: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  grid: {
    flex: 0,
  },
});
