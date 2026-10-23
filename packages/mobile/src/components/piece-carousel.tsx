import type { GestureResponderEvent } from "react-native";

import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { PieceSelection } from "@/model/game";

import { RunningGameContext } from "@/context/running-game-context";
import { type PieceModel } from "@/model/game";

import Piece from "./piece";
import PiecesMenu from "./pieces-menu";

export default function PieceCarousel({
  availablePieces,
  width,
}: {
  availablePieces: PieceModel[];
  width: number;
}) {
  const game = useContext(RunningGameContext);
  const [piecesSelections, setPiecesSelections] = useState<PieceSelection[]>(
    availablePieces.map(
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} horizontal>
        {carouselPieces.map((pieceSelection) => {
          const key = `${pieceSelection.pieceModel.piece}-${pieceSelection.pieceModel.color}`;
          return (
            <Piece
              style={{ gap: 30 }}
              key={key}
              width={pieceWidth}
              pieceSelection={pieceSelection}
              onPress={(event: GestureResponderEvent) => {
                event.stopPropagation();
                // TODO Rotation in future ticket
              }}
            ></Piece>
          );
        })}
      </ScrollView>
      <View style={styles.actions}>
        <PiecesMenu
          width={width}
          onSelection={(piece) => updateSelection(setPiecesSelections, piece)}
          piecesSelection={piecesSelections}
        />
      </View>
    </View>
  );
}

function updateSelection(setPiecesSelections, piece) {
  // TODO In ticket where you can play
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  actions: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
