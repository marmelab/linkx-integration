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

  if (game.local) {
    const currentColor =
      game.turnOfPlayer === "blue" ? (
        <Text style={styles.textBlue}>Blue</Text>
      ) : (
        <Text style={styles.textWhite}>Red</Text>
      );
    return <Text style={styles.heading}>Turn of {currentColor}</Text>;
  }

  const gameTitle = `${game.firstPlayer?.displayName ?? "Unknown player"} VS ${game.secondPlayer?.displayName ?? "Unknown player"}`;

  if (game.victory && game.lastMove?.color === "blue") {
    return (
      <Text style={styles.heading}>
        Victory of {game.firstPlayer?.displayName} !
      </Text>
    );
  } else if (game.victory) {
    return (
      <Text style={styles.heading}>
        Victory of {game.secondPlayer?.displayName} !
      </Text>
    );
  } else if (game.completed) {
    return <Text style={styles.heading}>It's a draw !</Text>;
  } else if (game.turnOfPlayer === "blue") {
    return (
      <>
        <Text style={styles.heading}>{gameTitle}</Text>
        <Text style={styles.subHeading}>
          Turn of{" "}
          <Text style={styles.textBlue}>
            {game.firstPlayer?.displayName}...
          </Text>
        </Text>
      </>
    );
  } else if (!game.secondPlayer) {
    return (
      <>
        <Text style={styles.heading}>{gameTitle}</Text>
        <Text style={styles.subHeading}>
          Waiting for a second player to join...
        </Text>
      </>
    );
  } else {
    return (
      <>
        <Text style={styles.heading}>{gameTitle}</Text>
        <Text style={styles.subHeading}>
          Turn of{" "}
          <Text style={styles.textWhite}>
            {game.secondPlayer?.displayName}...
          </Text>
        </Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    fontSize: 26,
    flex: 0,
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
