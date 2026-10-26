import type { GestureResponderEvent, ViewStyle } from "react-native";
import type { StyleProp } from "react-native";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { Color, PieceSelection } from "@/model/game";

import Cell from "./cell";
import PieceCountIndicator from "./piece-count-indicator";

type PieceProps = {
  pieceSelection: PieceSelection;
  onPressOut: (event: GestureResponderEvent) => void;
  onMirrorPiece?: (event: GestureResponderEvent) => void;
  width: number;
  style?: StyleProp<ViewStyle> | undefined;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
};

export default function Piece({
  pieceSelection,
  onPressOut,
  onMirrorPiece,
  width,
  style,
  contentContainerStyle,
}: PieceProps) {
  const selectedMatrix = pieceSelection.pieceModel.possibleMatrices.find(
    (possibleMatrix) => {
      return (
        possibleMatrix.mirrored.includes(pieceSelection.mirrored) &&
        possibleMatrix.rotations.includes(pieceSelection.selectedRotation)
      );
    },
  )?.matrix;

  if (!selectedMatrix) {
    console.error(
      `Unknown configuration for piece {piece: ${pieceSelection.pieceModel.piece}, rotation: ${pieceSelection.selectedRotation}, mirrored: ${pieceSelection.mirrored} }`,
    );
    return <></>;
  }

  const cells = formatMatrixForFlexWrap(
    selectedMatrix,
    pieceSelection.pieceModel.color,
  );

  const cellWidth = width / 3;
  const backgroundColor =
    pieceSelection.pieceModel.color === "blue" ? "#E0F0F9" : "#FFE9E6";

  const key = `${pieceSelection.pieceModel.piece}-${pieceSelection.pieceModel.color}`;
  return (
    <TouchableOpacity
      key={key}
      disabled={true} // TODO change on ticket about playing
      style={[
        styles.container,
        { height: width + 102, backgroundColor },
        style,
      ]}
      onPressOut={(event) => onPressOut(event)}
    >
      <View style={[styles.piece, contentContainerStyle]}>
        <PieceCountIndicator pieceModel={pieceSelection.pieceModel} />
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
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            return onMirrorPiece;
          }}
          style={[styles.buttonMirror, { width }]}
        >
          <Text>Mirror</Text>
        </Pressable>
      </View>
    </TouchableOpacity>
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
    flex: 1,
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
