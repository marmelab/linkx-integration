import type { GestureResponderEvent } from "react-native";

import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { PieceSelection } from "@/model/game";

import { RunningGameContext } from "@/context/running-game-context";

import Piece from "./piece";
import PiecesMenu from "./pieces-menu";

export default function PieceCarousel({ width }: { width: number }) {
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
              style={{ borderColor, borderWidth: 1 }}
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
