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

  const pieceGap = 16;
  const pieceWidth = (width - pieceGap * 3 - 10) / 4;
  const carouselPieces = Object.values(piecesSelections.pieces).filter(
    (piece) => piece.color === game?.turnOfPlayer,
  );

  return (
    <View style={{ flex: 0 }}>
      <ScrollView
        style={{ flex: 0 }}
        contentContainerStyle={[styles.container, { gap: pieceGap }]}
      >
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
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    rowGap: 8,
    borderRadius: 24,
  },
  actions: {
    paddingTop: 16,
    justifyContent: "flex-end",
  },
});
