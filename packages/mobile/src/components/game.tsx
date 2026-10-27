import type { QueryClient } from "@tanstack/react-query";

import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
import { useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
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
        pieceName: availablePiece.piece,
        color: availablePiece.color,
        mirrored: false,
        selectedRotation: 0,
      }),
    ),
  );

  const insets = useSafeAreaInsets();
  const width =
    Dimensions.get("screen").width - 20 - insets.left - insets.right;

  return (
    <View style={styles.game}>
      <View style={[styles.titleContainer, { width }]}>
        <TouchableOpacity
          onPress={() => onRequestClose()}
          style={[styles.button]}
        >
          <MaterialDesignIcons name="arrow-left" size={28} color="#9AA6B5" />
        </TouchableOpacity>
      </View>
      <GameLabel />
      <Grid
        disabled={playTurnMutation.mutation.isPending}
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
        disabled={playTurnMutation.mutation.isPending}
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
    (piece) => piece.color === game.turnOfPlayer && piece.selected,
  );
  if (!selectedPiece) {
    return;
  }

  const move: Move = {
    skipped: false,
    color: selectedPiece.color,
    piece: selectedPiece.pieceName,
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
    minWidth: 44,
    minHeight: 44,
    padding: 10,
    textAlign: "center",
    alignItems: "center",
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
