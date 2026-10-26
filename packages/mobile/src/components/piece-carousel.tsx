import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { PieceSelection } from "@/model/game";

import { RunningGameContext } from "@/context/running-game-context";

import Piece from "./piece";
import PiecesMenu from "./pieces-menu";

type PieceCarouselProps = { width: number };

export default function PieceCarousel({ width }: PieceCarouselProps) {
  const game = useContext(RunningGameContext);
  if (!game) {
    return <></>;
  }

  const [piecesSelections, setPiecesSelections] = useState<PieceSelection[]>(
    game.availablePieces.map(
      (availablePiece): PieceSelection => ({
        pieceModel: availablePiece,
        mirrored: false,
        selectedRotation: 0,
      }),
    ),
  );
  const pieceWidth = Math.max(90, 0.23 * width);
  const carouselPieces = piecesSelections.filter(
    (piece) => piece.pieceModel.color === game?.turnOfPlayer,
  );
  const backgroundColor = game?.turnOfPlayer === "blue" ? "#F6FBFD" : "#FFF8F8";
  const borderColor = game?.turnOfPlayer === "blue" ? "#006596" : "#9C4438";

  return (
    <View style={styles.carousel}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor, borderColor },
        ]}
        horizontal
      >
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
                  setPiecesSelections,
                  pieceSelection,
                );
              }}
            ></Piece>
          );
        })}
      </ScrollView>
      <View style={styles.actions}>
        <PiecesMenu
          width={width}
          onSelection={(piece) =>
            updateSelection(piecesSelections, setPiecesSelections, piece)
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
  setPiecesSelections: Function,
  selectedPiece: PieceSelection,
): void {
  const isAlreadySelected = piecesSelection.find((piece) =>
    isSamePiece(piece, selectedPiece),
  );
  if (isAlreadySelected) {
    setPiecesSelections(
      piecesSelection.map((piece) => {
        if (isSamePiece(piece, selectedPiece)) {
          return rotatePiece(piece);
        }
        return piece;
      }),
    );
  } else {
    setPiecesSelections(
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
    borderWidth: 2,
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
