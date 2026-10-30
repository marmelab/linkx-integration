import { StyleSheet, View } from "react-native";

import { piecesColor } from "@/style-constants";

import GlowingCell from "./glowing-cell";

type CellProps = {
  cellValue: string;
  width: number;
  isVictoryPath?: boolean;
};

export default function Cell({
  cellValue,
  width,
  isVictoryPath: isVictory,
}: CellProps) {
  const isLastMove =
    cellValue === "whiteLastMove" || cellValue === "blueLastMove";
  const isBlue = cellValue === "blueLastMove" || cellValue === "blue";
  const isEmpty = cellValue === "." || cellValue === "";

  return (
    <>
      {!isEmpty && (isVictory || isLastMove) && (
        <GlowingCell
          style={[styles.cell, { width }]}
          toColor={isBlue ? piecesColor.blueGlow : piecesColor.whiteGlow}
          fromColor={isBlue ? piecesColor.blue : piecesColor.white}
        />
      )}
      {!isEmpty && !(isVictory || isLastMove) && (
        <View
          style={[
            styles.cell,
            {
              width,
              backgroundColor: isBlue ? piecesColor.blue : piecesColor.white,
            },
          ]}
        ></View>
      )}
      {isEmpty && (
        <View
          style={[cellValue === "." ? styles.emptyCell : {}, { width }]}
        ></View>
      )}
    </>
  );
}

const borderColor = "#333";
const styles = StyleSheet.create({
  cell: {
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
  },
  emptyCell: {
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});
