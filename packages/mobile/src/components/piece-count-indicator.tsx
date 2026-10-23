import { StyleSheet, View } from "react-native";

import type { PieceModel } from "@/model/game";

const BASE_COUNT = 2;

export default function PieceCountIndicator({
  pieceModel,
}: {
  pieceModel: PieceModel;
}) {
  const baseClass = pieceModel.color === "blue" ? styles.blue : styles.white;
  const filledClass =
    pieceModel.color === "blue" ? styles.filledBlue : styles.filledWhite;

  const indicators = [];
  for (let i = 1; i <= pieceModel.count; i++) {
    indicators.push(
      <View
        key={`${pieceModel.piece}-${pieceModel.color}-count-filled-${i}`}
        style={[styles.mark, baseClass, filledClass]}
      ></View>,
    );
  }
  for (let i = 1; i <= BASE_COUNT - pieceModel.count; i++) {
    indicators.push(
      <View
        key={`${pieceModel.piece}-${pieceModel.color}-count-empty-${i}`}
        style={[styles.mark, baseClass]}
      ></View>,
    );
  }

  return <View style={styles.container}>{indicators}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  mark: {
    borderRadius: "50%",
    borderWidth: 2,
    width: 20,
    aspectRatio: "1 / 1",
  },
  blue: {
    borderColor: "#003C5A",
  },
  filledBlue: {
    backgroundColor: "#006596",
  },
  white: {
    borderColor: "#5D2822",
  },
  filledWhite: {
    backgroundColor: "#9C4438",
  },
});
