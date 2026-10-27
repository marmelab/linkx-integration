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
  const carouselPieces = Object.values(piecesSelections).filter(
    (piece) => piece.color === game?.turnOfPlayer,
  );

  return (
    <View style={styles.carousel}>
      <ScrollView contentContainerStyle={[styles.container]} horizontal>
        {carouselPieces.map((pieceSelection) => {
          return (
            <Piece
              disabled={disabled}
              contentContainerStyle={{ width: pieceWidth }}
              key={`${pieceSelection.pieceName}-${pieceSelection.color}`}
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

function isSamePiece(pieceA: PieceSelection, pieceB: PieceSelection) {
  return pieceA.color === pieceB.color && pieceA.pieceName === pieceB.pieceName;
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
  const isAlreadySelected = piecesSelection[pieceKey].selected;
  if (isAlreadySelected) {
    onPiecesSelectionChange({
      ...piecesSelection,
      [pieceKey]: rotatePiece(selectedPiece),
    });
  } else {
    onPiecesSelectionChange(
      transformPiecesSelection(piecesSelection, (key, piece) => {
        return [
          key,
          {
            ...piece,
            selected: key === pieceKey,
          },
        ];
      }),
    );
  }
}

function transformPiecesSelection(
  piecesSelection: MultiPieceSelection,
  callback: (
    key: string,
    pieceSelection: PieceSelection,
  ) => [string, PieceSelection],
) {
  return Object.fromEntries(
    Object.entries(piecesSelection).map(([key, piece]) => {
      return callback(key, piece);
    }),
  );
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
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderRadius: 24,
  },
  carousel: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  actions: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
