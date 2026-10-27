import type { QueryClient } from "@tanstack/react-query";

import { useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { PlayTurnParams } from "@/hooks/games/use-play-turn-mutation";
import type { GameModel, PieceSelection } from "@/model/game";
import type { Move } from "@/model/move";

import { RunningGameContext } from "@/context/running-game-context";
import { usePlayTurnMutation } from "@/hooks/games/use-play-turn-mutation";

import GameLabel from "./game-label";
import Grid from "./grid";
import PieceCarousel from "./piece-carousel";

type GameProps = {
  onRequestClose: () => void;
};

export default function Game({ onRequestClose }: GameProps) {
  const game = useContext(RunningGameContext);
  const queryClient = useQueryClient();

  if (!game) {
    return <></>;
  }

  const playTurnMutation = usePlayTurnMutation();

  const [piecesSelections, setPiecesSelections] = useState<PieceSelection[]>(
    game.availablePieces.map(
      (availablePiece): PieceSelection => ({
        pieceModel: availablePiece,
        mirrored: false,
        selectedRotation: 0,
      }),
    ),
  );

  const insets = useSafeAreaInsets();
  const width =
    Dimensions.get("screen").width - 20 - insets.left - insets.right;
  const carouselKey =
    "carousel-" +
    piecesSelections.reduce((sum, piece) => sum + piece.pieceModel.count, 0);

  return (
    <View style={styles.game}>
      <View style={[styles.titleContainer, { width }]}>
        <Pressable
          onPress={onRequestClose}
          style={[styles.button, styles.buttonReturn]}
        >
          <Text>Exit</Text>
        </Pressable>
      </View>
      <GameLabel />
      <Grid
        onColumnSelection={(column) =>
          handleColumnSelection(
            column,
            game,
            piecesSelections,
            playTurnMutation.mutation,
            queryClient,
          )
        }
        width={width}
      />
      {playTurnMutation.mutation.error ? (
        <View style={[styles.errorContainer, { width }]}>
          <Text style={styles.errorText}>
            {playTurnMutation.mutation.error.message}
          </Text>
        </View>
      ) : (
        <View style={styles.noErrorPadding} />
      )}
      <PieceCarousel
        key={carouselKey}
        piecesSelections={piecesSelections}
        onPiecesSelectionChange={setPiecesSelections}
        width={width}
      />
    </View>
  );
}

function handleColumnSelection(
  column: number,
  game: GameModel,
  piecesSelection: PieceSelection[],
  playTurnMutation: UseMutationResult<void, Error, PlayTurnParams, unknown>,
  queryClient: QueryClient,
) {
  const selectedPiece = piecesSelection.find(
    (piece) => piece.pieceModel.color === game.turnOfPlayer && piece.selected,
  );
  if (!selectedPiece) {
    return;
  }

  const move: Move = {
    skipped: false,
    color: game.turnOfPlayer,
    piece: selectedPiece.pieceModel.piece,
    column,
    mirrored: selectedPiece.mirrored,
    rotation: selectedPiece.selectedRotation,
  };

  playTurnMutation.mutate(
    { gameId: game.id, move },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["game", game.id] }),
    },
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
