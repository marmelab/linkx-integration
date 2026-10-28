import { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { MultiPieceSelection, PieceSelection } from "@/model/game";

import { RunningGameContext } from "@/context/running-game-context";
import { getPieceKey } from "@/helper/get-piece-key";

import Piece from "./piece";
import PiecesMenu from "./pieces-menu";

type PieceCarouselProps = {
  width: number;
  piecesSelections: MultiPieceSelection;
  onPiecesSelectionChange: (piecesSelections: MultiPieceSelection) => void;
  disabled: boolean;
};

export default function PieceCarousel({
  width,
  piecesSelections,
  onPiecesSelectionChange,
  disabled,
}: PieceCarouselProps) {
  const game = useContext(RunningGameContext);
  if (!game) {
    return <></>;
  }

  const pieceWidth = Math.max(90, 0.23 * width);
  const carouselPieces = Object.values(piecesSelections.pieces).filter(
    (piece) => piece.color === game?.turnOfPlayer,
  );

  return (
    <View style={styles.carousel}>
      <ScrollView contentContainerStyle={[styles.container]} horizontal>
        {carouselPieces.map((pieceSelection) => {
          const pieceKey = getPieceKey(
            pieceSelection.color,
            pieceSelection.pieceName,
          );
          return (
            <Piece
              selected={pieceKey === piecesSelections.selectedKey}
              disabled={disabled}
              contentContainerStyle={{ width: pieceWidth }}
              key={`${pieceKey}-${pieceKey === piecesSelections.selectedKey}`}
              width={pieceWidth}
              pieceSelection={pieceSelection}
              onMirrorPiece={() =>
                mirrorPiece(
                  piecesSelections,
                  onPiecesSelectionChange,
                  pieceSelection,
                )
              }
              onPressOut={() => {
                updateSelection(
                  piecesSelections,
                  onPiecesSelectionChange,
                  pieceSelection,
                );
              }}
            />
          );
        })}
      </ScrollView>
      <View style={styles.actions}>
        <PiecesMenu
          width={width}
          onSelection={(piece) =>
            updateSelection(piecesSelections, onPiecesSelectionChange, piece)
          }
          piecesSelection={piecesSelections}
        />
      </View>
    </View>
  );
}

function mirrorPiece(
  piecesSelection: MultiPieceSelection,
  onPiecesSelectionChange: (piecesSelections: MultiPieceSelection) => void,
  selectedPiece: PieceSelection,
): void {
  const pieceKey = getPieceKey(selectedPiece.color, selectedPiece.pieceName);

  onPiecesSelectionChange(
    transformPiecesSelection(piecesSelection, (key, piece) => {
      if (key === pieceKey) {
        const updatedRotation = reverseOddRotations(piece.selectedRotation);
        return [
          key,
          {
            ...piece,
            selectedRotation: updatedRotation,
            mirrored: !piece.mirrored,
            selected: true,
          },
        ];
      }

      return [
        key,
        {
          ...piece,
          selected: false,
        },
      ];
    }),
  );
}

function updateSelection(
  piecesSelection: MultiPieceSelection,
  onPiecesSelectionChange: (piecesSelections: MultiPieceSelection) => void,
  selectedPiece: PieceSelection,
): void {
  const pieceKey = getPieceKey(selectedPiece.color, selectedPiece.pieceName);
  const isAlreadySelected = pieceKey === piecesSelection.selectedKey;
  if (isAlreadySelected) {
    onPiecesSelectionChange({
      ...piecesSelection,
      pieces: {
        ...piecesSelection.pieces,
        [pieceKey]: rotatePiece(selectedPiece),
      },
    });
  } else {
    onPiecesSelectionChange({
      ...piecesSelection,
      selectedKey: pieceKey,
    });
  }
}

function transformPiecesSelection(
  piecesSelection: MultiPieceSelection,
  callback: (
    key: string,
    pieceSelection: PieceSelection,
  ) => [string, PieceSelection],
): MultiPieceSelection {
  return {
    ...piecesSelection,
    pieces: Object.fromEntries(
      Object.entries(piecesSelection.pieces).map(([key, piece]) => {
        return callback(key, piece);
      }),
    ),
  };
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

function rotatePiece(piece: PieceSelection): PieceSelection {
  const updatedRotation = (piece.selectedRotation + 1) % 4;
  return {
    ...piece,
    selectedRotation: updatedRotation,
  };
}

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderRadius: 24,
  },
  actions: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
