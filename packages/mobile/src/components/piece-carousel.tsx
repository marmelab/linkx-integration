import { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { MultiPieceSelection, PieceSelection } from "@/model/game";

import { RunningGameContext } from "@/context/running-game-context";
import { getPieceKey } from "@/helper/get-piece-key";

import Piece from "./piece";

type PieceCarouselProps = {
  width: number;
  piecesSelections: MultiPieceSelection;
  onSelection: (pieceSelection: PieceSelection) => void;
  disabled: boolean;
};

export default function PieceCarousel({
  width,
  piecesSelections,
  onSelection,
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
              onPressOut={() => onSelection(pieceSelection)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
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
