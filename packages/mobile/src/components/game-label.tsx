import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

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
    <View style={{ height: 44, justifyContent: "center" }}>
      {(!game.local || game.completed) && (
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
      )}
      {!game.completed && (
        <Text style={styles.subHeading}>
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
          's Turn
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    flex: 0,
  },
  subHeading: {
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
