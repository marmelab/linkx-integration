import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { PieceSelection } from "@/model/game";

import Piece from "./piece";

export default function PiecesMenu({
  piecesSelection,
  width,
  onSelection,
}: {
  piecesSelection: PieceSelection[];
  width: number;
  onSelection: (piece: PieceSelection) => void;
}) {
  const [menuOpened, setMenuOpened] = useState(false);

  // TODO Order based on current turn for local play
  // TODO Order based on current player for online play
  const bluePieces = piecesSelection.filter(
    (piece) => piece.pieceModel.color === "blue",
  );
  const whitePieces = piecesSelection.filter(
    (piece) => piece.pieceModel.color === "white",
  );
  const pieceWidth = Math.max(90, 0.23 * width);
  let scrollView: ScrollView | null;

  return (
    <View style={styles.container}>
      <Modal
        style={{ flexDirection: "column" }}
        animationType="none"
        transparent={false}
        visible={menuOpened}
        onRequestClose={() => setMenuOpened(false)}
      >
        <View style={{ flex: 1 }}></View>
        <ScrollView
          ref={(ref) => {
            scrollView = ref;
          }}
          onContentSizeChange={() =>
            scrollView?.scrollToEnd({ animated: false })
          }
        >
          <View style={[styles.piecesContainer, styles.blueContainer]}>
            {bluePieces.map((piece) => {
              const key = `${piece.pieceModel.piece}-${piece.pieceModel.color}`;
              return (
                <Piece
                  style={{ width: pieceWidth }}
                  key={key}
                  pieceSelection={piece}
                  width={pieceWidth}
                  onPress={() => onSelection(piece)}
                />
              );
            })}
          </View>
          <View style={[styles.piecesContainer, styles.whiteContainer]}>
            {whitePieces.map((piece) => {
              const key = `${piece.pieceModel.piece}-${piece.pieceModel.color}`;
              return (
                <Piece
                  style={{ width: pieceWidth }}
                  key={key}
                  pieceSelection={piece}
                  width={pieceWidth}
                  onPress={() => onSelection(piece)}
                />
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.buttonReturn]}
            onPress={() => setMenuOpened(false)}
          >
            <Text style={styles.buttonText}>Back to game</Text>
          </Pressable>
        </View>
      </Modal>

      <View style={[styles.actions, { width }]}>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setMenuOpened(true)}
        >
          <Text style={styles.buttonText}>See pieces</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  blueContainer: {
    backgroundColor: "#F6FBFD",
    borderColor: "#006596",
    borderWidth: 1,
  },
  whiteContainer: {
    backgroundColor: "#FFF8F8",
    borderColor: "#9C4438",
    borderWidth: 1,
  },
  piecesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 22,
    borderRadius: 15,
    margin: 11,
    gap: 16,
  },
  button: {
    minWidth: 60,
    minHeight: 60,
    borderRadius: 20,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 22,
  },
  buttonOpen: {
    backgroundColor: "#84C5E6",
    borderColor: "#005179",
  },
  buttonReturn: {
    backgroundColor: "#B5BEC8",
    borderColor: "#424D5B",
  },
  actions: {
    justifyContent: "flex-end",
  },
});
