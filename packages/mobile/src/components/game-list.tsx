import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLastLocalGameId } from "@/hooks/games/storage/use-last-local-game-id";
import { primary } from "@/style-constants";

import SpectateGamesList from "./spectate-games-list";

export default function GamesList() {
  const currentGameId = useLastLocalGameId().data;

  return (
    <>
      <Text style={[styles.basicText, styles.heading]}>Your games:</Text>
      {currentGameId ? (
        <TouchableOpacity
          key={`game-${currentGameId}`}
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
            <Text style={styles.basicText}>Resume game</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.secondaryText}>No current game.</Text>
      )}

      <SpectateGamesList />
    </>
  );
}

const styles = StyleSheet.create({
  listElement: {
    flexDirection: "row",
    borderColor: primary[800],
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    marginBottom: 8,
    borderRadius: 20,
  },
  disabledElement: {
    backgroundColor: "#ECEEF1",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  basicText: {
    textAlign: "center",
    color: primary[800],
    fontSize: 24,
  },
  secondaryText: {
    textAlign: "center",
    color: "#617388",
    fontSize: 24,
  },
});
