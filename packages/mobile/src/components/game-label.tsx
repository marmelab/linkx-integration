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
      <Text style={styles.heading}>
        {!game.local && (
          <>
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
          </>
        )}
        {game.victory &&
          (game.lastMove?.color === "blue" ? (
            <>
              Victory of{" "}
              <GamePlayerLabel
                fallbackName="Blue"
                player={game.firstPlayer}
                style={styles.textBlue}
              />
            </>
          ) : (
            <>
              Victory of{" "}
              <GamePlayerLabel
                fallbackName="Red"
                player={game.secondPlayer}
                style={styles.textWhite}
              />
            </>
          ))}
        {!game.victory && game.completed && <>It's a draw !</>}
      </Text>
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
          )}
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
