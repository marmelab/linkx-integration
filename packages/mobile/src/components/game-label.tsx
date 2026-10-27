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

  const firstPlayerLabel = game.firstPlayer?.displayName ? (
    <Text style={styles.textBlue}>{game.firstPlayer.displayName}</Text>
  ) : (
    <Text style={styles.textBlue}>Blue</Text>
  );
  const secondPlayerLabel = game.secondPlayer?.displayName ? (
    <Text style={styles.textWhite}>{game.secondPlayer.displayName}</Text>
  ) : (
    <Text style={styles.textWhite}>Red</Text>
  );

  const currentLabel =
    game.turnOfPlayer === "blue" ? firstPlayerLabel : secondPlayerLabel;

  if (game.local && !game.completed) {
    return <Text style={styles.heading}>Turn of {currentLabel}</Text>;
  }

  const gameTitle = (
    <Text>
      {firstPlayerLabel} VS {secondPlayerLabel}
    </Text>
  );

  if (game.victory && game.lastMove?.color === "blue") {
    return <Text style={styles.heading}>Victory of {firstPlayerLabel} !</Text>;
  } else if (game.victory) {
    return <Text style={styles.heading}>Victory of {secondPlayerLabel} !</Text>;
  } else if (game.completed) {
    return <Text style={styles.heading}>It's a draw !</Text>;
  } else if (game.turnOfPlayer === "blue") {
    return (
      <>
        <Text style={styles.heading}>{gameTitle}</Text>
        <Text style={styles.subHeading}>
          Turn of <Text style={styles.textBlue}>{firstPlayerLabel}...</Text>
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
          Turn of <Text style={styles.textWhite}>{secondPlayerLabel}...</Text>
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
