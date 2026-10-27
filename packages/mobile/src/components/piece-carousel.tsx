import { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { PieceSelection } from "@/model/game";

import { RunningGameContext } from "@/context/running-game-context";

import Piece from "./piece";
import PiecesMenu from "./pieces-menu";

type PieceCarouselProps = {
  width: number;
  piecesSelections: PieceSelection[];
  onPiecesSelectionChange: (piecesSelections: PieceSelection[]) => void;
};

export default function PieceCarousel({
  width,
  piecesSelections,
  onPiecesSelectionChange,
}: PieceCarouselProps) {
  const game = useContext(RunningGameContext);
  if (!game) {
    return <></>;
  }

  const pieceWidth = Math.max(90, 0.23 * width);
  const carouselPieces = piecesSelections.filter(
    (piece) => piece.pieceModel.color === game?.turnOfPlayer,
  );

  return (
    <View style={styles.carousel}>
      <ScrollView contentContainerStyle={[styles.container]} horizontal>
        {carouselPieces.map((pieceSelection) => {
          const key = `${pieceSelection.pieceModel.piece}-${pieceSelection.pieceModel.color}`;
          return (
            <Piece
              contentContainerStyle={{ width: pieceWidth }}
              key={key}
              width={pieceWidth}
              pieceSelection={pieceSelection}
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
  return (
    pieceA.pieceModel.color === pieceB.pieceModel.color &&
    pieceA.pieceModel.piece === pieceB.pieceModel.piece
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
    // TODO scroll to piece
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
