import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { GameModel } from "@/model/game";

export default function GameListElement({
  game,
  onSelection,
}: {
  game: GameModel;
  onSelection: (id: number) => void;
}) {
  const versusStr = game.secondPlayer
    ? `${game.firstPlayer.displayName} VS ${game.secondPlayer.displayName}`
    : `${game.firstPlayer.displayName} is waiting for a match...`;
  return (
    <TouchableOpacity key={game.id} onPress={() => onSelection(game.id)}>
      <View style={styles.listElement}>
        <Text style={styles.basicText}>{versusStr}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listElement: {
    flexDirection: "row",
    backgroundColor: "#D0D5DC",
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    marginLeft: 22,
    marginRight: 22,
    marginBottom: 8,
    borderRadius: 12,
  },
  basicText: {
    textAlign: "center",
    color: "#333333",
    fontSize: 24,
  },
});
