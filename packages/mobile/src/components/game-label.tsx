import { useContext } from "react";
import { StyleSheet, Text } from "react-native";

import { RunningGameContext } from "@/context/running-game-context";

import GamePlayerLabel from "./game-player-label";

export default function GameLabel() {
  const game = useContext(RunningGameContext);
  if (!game) {
    return (
      <Text style={styles.heading}>
        Error encountered when displaying the game.
      </Text>
    );
  }

  return (
    <>
      {!game.local && (
        <Text style={styles.heading}>
          <GamePlayerLabel
            fallbackName="Blue"
            player={game.firstPlayer}
            style={styles.textBlue}
          />{" "}
          VS{" "}
          <GamePlayerLabel
            fallbackName="Red"
            player={game.secondPlayer}
            style={styles.textWhite}
          />
        </Text>
      )}
      {game.victory && game.lastMove?.color === "blue" ? (
        <Text style={styles.heading}>
          Victory of{" "}
          <GamePlayerLabel
            fallbackName="Blue"
            player={game.firstPlayer}
            style={styles.textBlue}
          />
        </Text>
      ) : (
        <Text style={styles.heading}>
          Victory of{" "}
          <GamePlayerLabel
            fallbackName="Red"
            player={game.secondPlayer}
            style={styles.textWhite}
          />
        </Text>
      )}
      {!game.victory && game.completed && (
        <Text style={styles.heading}>It's a draw !</Text>
      )}
      {!game.completed && (
        <Text style={styles.subHeading}>
          Turn of{" "}
          {game.turnOfPlayer === "blue" ? (
            <GamePlayerLabel
              fallbackName="Blue"
              player={game.firstPlayer}
              style={styles.textBlue}
            />
          ) : (
            <GamePlayerLabel
              fallbackName="Red"
              player={game.secondPlayer}
              style={styles.textWhite}
            />
          )}{" "}
        </Text>
      )}
    </>
  );
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
