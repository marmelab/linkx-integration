import { StyleSheet, View } from "react-native";

type CellProps = {
  cellValue: string;
  width: number;
};

export default function Cell({ cellValue, width }: CellProps) {
  switch (cellValue) {
    case "white":
    case "whiteLastMove":
      return <View style={{ ...styles.cellWhite, width }}></View>;
    case "blue":
    case "blueLastMove":
      return <View style={{ ...styles.cellBlue, width }}></View>;
    case ".":
      return <View style={{ ...styles.emptyCell, width }}></View>;
    default:
      return <View style={{ width }}></View>;
  }
}

const borderColor = "#333";
const styles = StyleSheet.create({
  cellWhite: {
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#9C4438",
  },
  cellBlue: {
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#006596",
  },
  emptyCell: {
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});
