import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
import { useContext, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { MultiPieceSelection, PieceSelection } from "@/model/game";
import type { Move } from "@/model/move";

import { RunningGameContext } from "@/context/running-game-context";
import { getPieceKey } from "@/helper/get-piece-key";
import { usePlayTurnMutation } from "@/hooks/games/use-play-turn-mutation";

import GameLabel from "./game-label";
import Grid from "./grid";
import PieceCarousel from "./piece-carousel";
import PieceSelectionControls from "./piece-selection-controls";
import PiecesMenu from "./pieces-menu";

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
  const buttonWidth = 44;
  const carouselGap = 16;
  const width =
    Dimensions.get("screen").width - 44 - insets.left - insets.right;

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
      <View style={styles.carouselContainer}>
        <PieceCarousel
          disabled={playTurnMutation.isPending}
          piecesSelections={piecesSelections}
          onSelection={(piece) =>
            setPiecesSelections(selectPiece(piecesSelections, piece))
          }
          width={width - buttonWidth - carouselGap}
        />
        {piecesSelections.selectedKey && (
          <PieceSelectionControls
            onMirror={() => setPiecesSelections(mirrorPiece(piecesSelections))}
            onRotateClockwise={() =>
              setPiecesSelections(rotatePiece(piecesSelections, true))
            }
            onRotateCounterClockwise={() =>
              setPiecesSelections(rotatePiece(piecesSelections, false))
            }
          />
        )}
      </View>
      <View style={styles.actions}>
        <PiecesMenu
          width={width}
          onSelection={(piece) =>
            setPiecesSelections({
              ...piecesSelections,
              selectedKey: getPieceKey(piece.color, piece.pieceName),
            })
          }
          piecesSelection={piecesSelections}
        />
      </View>
    </View>
  );
}

function selectPiece(
  piecesSelection: MultiPieceSelection,
  piece: PieceSelection,
): MultiPieceSelection {
  return {
    ...piecesSelection,
    selectedKey: getPieceKey(piece.color, piece.pieceName),
  };
}

function mirrorPiece(piecesSelections: MultiPieceSelection) {
  if (!piecesSelections.selectedKey) {
    return piecesSelections;
  }

  return {
    ...piecesSelections,
    pieces: {
      ...piecesSelections.pieces,
      [piecesSelections.selectedKey]: {
        ...piecesSelections.pieces[piecesSelections.selectedKey],
        selectedRotation: reverseOddRotations(
          piecesSelections.pieces[piecesSelections.selectedKey]
            .selectedRotation,
        ),
        mirrored:
          !piecesSelections.pieces[piecesSelections.selectedKey].mirrored,
      },
    },
  };
}

function rotatePiece(
  piecesSelections: MultiPieceSelection,
  clockwise: boolean,
) {
  if (!piecesSelections.selectedKey) {
    return piecesSelections;
  }

  return {
    ...piecesSelections,
    pieces: {
      ...piecesSelections.pieces,
      [piecesSelections.selectedKey]: {
        ...piecesSelections.pieces[piecesSelections.selectedKey],
        selectedRotation: correctRotationOverFlow(
          piecesSelections.pieces[piecesSelections.selectedKey]
            .selectedRotation + (clockwise ? 1 : -1),
        ),
      },
    },
  };
}

function correctRotationOverFlow(rotation: number) {
  const updatedRotation = rotation % 4;
  if (updatedRotation < 0) {
    return 4 + updatedRotation;
  }
  return updatedRotation;
}

function reverseOddRotations(rotation: number) {
  if (rotation === 1) {
    return 3;
  }
  if (rotation === 3) {
    return 1;
  }

  return rotation;
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
  carouselContainer: {
    flexDirection: "row",
    gap: 16,
  },
});
