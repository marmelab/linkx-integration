import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

type PieceSelectionControlsProps = {
  onRotateClockwise: () => void;
  onMirror: () => void;
  onRotateCounterClockwise: () => void;
};

export default function PieceSelectionControls({
  onRotateClockwise,
  onMirror,
  onRotateCounterClockwise,
}: PieceSelectionControlsProps) {
  const iconSize = 36;
  const iconColor = "#303943";
  return (
    <View style={styles.container}>
      <Pressable style={styles.control} onPress={onRotateCounterClockwise}>
        <MaterialDesignIcons
          name="rotate-left"
          size={iconSize}
          color={iconColor}
        ></MaterialDesignIcons>
      </Pressable>
      <Pressable style={styles.control} onPress={onMirror}>
        <MaterialDesignIcons
          name="mirror-variant"
          size={iconSize}
          color={iconColor}
        ></MaterialDesignIcons>
      </Pressable>
      <Pressable style={styles.control} onPress={onRotateClockwise}>
        <MaterialDesignIcons
          name="rotate-right"
          size={iconSize}
          color={iconColor}
        ></MaterialDesignIcons>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: "column",
    gap: 20,
    justifyContent: "center",
  },
  control: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    backgroundColor: "#53AFDC",
    borderColor: "#005179",
    borderWidth: 2,
    color: "#303943",
    borderRadius: 12,
  },
});
