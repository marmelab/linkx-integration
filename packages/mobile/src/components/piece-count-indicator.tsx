import { StyleSheet, View } from "react-native";

import type { Color } from "@/model/game";

export default function PieceCountIndicator({
  count,
  color,
}: {
  count: number;
  color: Color;
}) {
  const baseClass = color === "blue" ? styles.blue : styles.white;
  const filledClass = color === "blue" ? styles.filledBlue : styles.filledWhite;
  if (count === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.mark, baseClass]}></View>
        <View style={[styles.mark, baseClass]}></View>
      </View>
    );
  } else if (count === 1) {
    return (
      <View style={styles.container}>
        <View style={[styles.mark, baseClass, filledClass]}></View>
        <View style={[styles.mark, baseClass]}></View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={[styles.mark, baseClass, filledClass]}></View>
        <View style={[styles.mark, baseClass, filledClass]}></View>
      </View>
    );
  }
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
