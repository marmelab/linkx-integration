import { useContext } from "react";
import { StyleSheet, Text } from "react-native";

import { RunningGameContext } from "@/context/running-game-context";

export default function GameLabel() {
  const game = useContext(RunningGameContext);
  if (!game) {
    return (
      <Text style={styles.heading}>
        Error encountered when displaying the game.
      </Text>
    );
  }

  if (game.victory && game.lastMove?.color === "blue") {
    return (
      <Text style={[styles.heading, { flex: 0 }]}>
        Victory of {game.firstPlayer.displayName} !
      </Text>
    );
  } else if (game.victory) {
    return (
      <Text style={[styles.heading, { flex: 0 }]}>
        Victory of {game.secondPlayer?.displayName} !
      </Text>
    );
  } else if (game.completed) {
    return <Text style={styles.heading}>It's a draw !</Text>;
  } else if (game.turnOfPlayer === "blue") {
    return (
      <Text style={styles.subHeading}>
        Turn of{" "}
        <Text style={styles.textBlue}>{game.firstPlayer.displayName}...</Text>
      </Text>
    );
  } else if (!game.secondPlayer) {
    return (
      <Text style={styles.subHeading}>
        Waiting for a second player to join...
      </Text>
    );
  } else {
    return (
      <Text style={styles.subHeading}>
        Turn of{" "}
        <Text style={styles.textWhite}>
          {game.secondPlayer?.displayName}...
        </Text>
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    fontSize: 26,
    flex: 1,
  },
  subHeading: {
    textAlign: "center",
    fontSize: 20,
    color: "#666",
  },
  textBlue: {
    color: "#006596",
  },
  textWhite: {
    color: "#9C4438",
  },
});
