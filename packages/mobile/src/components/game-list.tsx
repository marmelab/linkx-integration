import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SpectateGamesList from "./spectate-games-list";

type GameListProps = {
  currentGameId?: string | null;
};

export default function GamesList({ currentGameId }: GameListProps) {
  if (currentGameId) {
    return (
      <>
        <Text style={[styles.basicText, styles.heading]}>Your games:</Text>
        <TouchableOpacity
          key={currentGameId}
          onPress={() => {
            router.navigate({
              pathname: "/game/[id]",
              params: {
                id: currentGameId,
                mode: "playing-local",
              },
            });
          }}
        >
          <View style={styles.listElement}>
            <Text style={styles.basicText}>
              Resume game{" "}
              <MaterialDesignIcons name="location-enter" size={28} />
            </Text>
          </View>
        </TouchableOpacity>
        <SpectateGamesList />
      </>
    );
  }

  return (
    <>
      <Text style={[styles.basicText, styles.heading]}>Your games:</Text>
      <Text style={styles.secondaryText}>No current game.</Text>
      <SpectateGamesList />
    </>
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
    marginBottom: 8,
    borderRadius: 12,
  },
  disabledElement: {
    backgroundColor: "#ECEEF1",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  basicText: {
    textAlign: "center",
    color: "#333333",
    fontSize: 24,
  },
  secondaryText: {
    textAlign: "center",
    color: "#617388",
    fontSize: 24,
  },
});
