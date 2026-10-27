import type { JSX } from "react/jsx-runtime";

import { StyleSheet, View } from "react-native";

import type { PieceModel } from "@/model/game";

const BASE_COUNT = 2;

type PieceCountIndicatorProps = {
  pieceModel: PieceModel;
};

export default function PieceCountIndicator({
  pieceModel,
}: PieceCountIndicatorProps) {
  const baseClass = pieceModel.color === "blue" ? styles.blue : styles.white;
  const filledClass =
    pieceModel.color === "blue" ? styles.filledBlue : styles.filledWhite;

  const accumulatorBase: JSX.Element[] = [];
  const indicators = Array.from({ length: BASE_COUNT }).reduce(
    (accumulator: JSX.Element[], _, index) => {
      if (index < pieceModel.count) {
        return [
          ...accumulator,
          <View
            key={`${pieceModel.piece}-${pieceModel.color}-count-filled-${index}`}
            style={[styles.mark, baseClass, filledClass]}
          ></View>,
        ];
      }
      return [
        ...accumulator,
        <View
          key={`${pieceModel.piece}-${pieceModel.color}-count-empty-${index}`}
          style={[styles.mark, baseClass]}
        ></View>,
      ];
    },
    accumulatorBase,
  );

  const key = `count-${pieceModel.color}-${pieceModel.piece}:${pieceModel.count}`;

  return (
    <View key={key} style={styles.container}>
      {indicators}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
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
