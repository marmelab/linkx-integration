import { useContext, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { MultiPieceSelection } from "@/model/game";
import type { Move } from "@/model/move";

import { RunningGameContext } from "@/context/running-game-context";
import { getPieceKey } from "@/helper/get-piece-key";
import { usePlayTurnMutation } from "@/hooks/games/use-play-turn-mutation";

import GameLabel from "./game-label";
import Grid from "./grid";
import PieceCarousel from "./piece-carousel";

type GameProps = {
  onRequestClose: () => void;
};

export default function Game({ onRequestClose }: GameProps) {
  const game = useContext(RunningGameContext);

  if (!game) {
    return null;
  }

  const playTurnMutation = usePlayTurnMutation(game.id);

  const [piecesSelections, setPiecesSelections] = useState<MultiPieceSelection>(
    {
      pieces: game.availablePieces.reduce((mapped, availablePiece) => {
        return {
          ...mapped,
          [getPieceKey(availablePiece.color, availablePiece.piece)]: {
            pieceName: availablePiece.piece,
            color: availablePiece.color,
            mirrored: false,
            selectedRotation: 0,
          },
        };
      }, {}),
    },
  );

  const insets = useSafeAreaInsets();
  const width =
    Dimensions.get("screen").width - 44 - insets.left - insets.right;

  return (
    <View style={styles.game}>
      <View style={[styles.titleContainer, { width }]}>
        <Pressable
          onPress={() => onRequestClose()}
          style={[styles.button, styles.buttonReturn]}
        >
          <Text>Exit</Text>
        </Pressable>
      </View>
      <GameLabel />
      <Grid
        disabled={playTurnMutation.isPending}
        onColumnSelection={(column) => {
          if (!piecesSelections.selectedKey) {
            return;
          }
          const selectedPiece =
            piecesSelections.pieces[piecesSelections.selectedKey];

          const move: Move = {
            skipped: false,
            color: selectedPiece.color,
            piece: selectedPiece.pieceName,
            column,
            mirrored: selectedPiece.mirrored,
            rotation: selectedPiece.selectedRotation,
          };

          playTurnMutation.mutate({ gameId: game.id, move });
        }}
        width={width}
      />
      {playTurnMutation.error ? (
        <View style={[styles.errorContainer, { width }]}>
          <Text style={styles.errorText}>{playTurnMutation.error.message}</Text>
        </View>
      ) : (
        <View style={styles.noErrorPadding} />
      )}
      <PieceCarousel
        disabled={playTurnMutation.isPending}
        piecesSelections={piecesSelections}
        onPiecesSelectionChange={setPiecesSelections}
        width={width}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  game: {
    flex: 1,
    alignItems: "center",
  },
  actions: {
    flex: 1,
    justifyContent: "flex-end",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 0,
    minWidth: 60,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    textAlign: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  buttonReturn: {
    position: "absolute",
    left: 0,
    top: 10,
    borderColor: "#9AA6B5",
    backgroundColor: "#ECEEF1",
  },
  errorText: {
    color: "#9C4438",
  },
  errorContainer: {
    height: 45,
    backgroundColor: "#FFC8C0",
    borderWidth: 1,
    borderColor: "#9C4438",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  noErrorPadding: {
    height: 45,
  },
});
