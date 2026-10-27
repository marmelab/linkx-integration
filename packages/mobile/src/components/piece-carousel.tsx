import { useContext } from "react";
import { StyleSheet, View } from "react-native";

import type { PieceSelection } from "@/model/game";

import { RunningGameContext } from "@/context/running-game-context";

import Piece from "./piece";
import PiecesMenu from "./pieces-menu";

type PieceCarouselProps = {
  width: number;
  piecesSelections: PieceSelection[];
  onPiecesSelectionChange: (piecesSelections: PieceSelection[]) => void;
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

  const pieceWidth = Math.max(70, 0.17 * width);
  const carouselPieces = piecesSelections.filter(
    (piece) => piece.color === game?.turnOfPlayer,
  );

  return (
    <View style={styles.carousel}>
      <View style={[styles.container]}>
        {carouselPieces.map((pieceSelection) => {
          const key = `${pieceSelection.pieceName}-${pieceSelection.color}`;
          return (
            <Piece
              disabled={disabled}
              contentContainerStyle={{ width: pieceWidth }}
              key={key}
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
      </View>
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
  piecesSelection: PieceSelection[],
  onPiecesSelectionChange: (piecesSelections: PieceSelection[]) => void,
  selectedPiece: PieceSelection,
): void {
  onPiecesSelectionChange(
    piecesSelection.map((piece) => {
      if (isSamePiece(piece, selectedPiece)) {
        const updatedRotation = reverseOddRotations(piece.selectedRotation);
        return {
          ...piece,
          selectedRotation: updatedRotation,
          mirrored: !piece.mirrored,
          selected: true,
        };
      }

      return {
        ...piece,
        selected: false,
      };
    }),
  );
}

function updateSelection(
  piecesSelection: PieceSelection[],
  onPiecesSelectionChange: (piecesSelections: PieceSelection[]) => void,
  selectedPiece: PieceSelection,
): void {
  const isAlreadySelected = piecesSelection.find(
    (piece) => isSamePiece(piece, selectedPiece) && piece.selected,
  );
  if (isAlreadySelected) {
    onPiecesSelectionChange(
      piecesSelection.map((piece) => {
        if (isSamePiece(piece, selectedPiece)) {
          return rotatePiece(piece);
        }
        return piece;
      }),
    );
  } else {
    onPiecesSelectionChange(
      piecesSelection.map((piece) => {
        return {
          ...piece,
          selected: isSamePiece(piece, selectedPiece),
        };
      }),
    );
  }
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
    flexWrap: "wrap",
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
