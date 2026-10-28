import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { MultiPieceSelection, PieceSelection } from "@/model/game";

import Piece from "./piece";

type PiecesMenuProps = {
  piecesSelection: MultiPieceSelection;
  width: number;
  onSelection: (piece: PieceSelection) => void;
};

export default function PiecesMenu({
  piecesSelection,
  width,
  onSelection,
}: PiecesMenuProps) {
  const [menuOpened, setMenuOpened] = useState(false);

  // TODO Order based on current turn for local play
  // TODO Order based on current player for online play
  const bluePieces = Object.values(piecesSelection.pieces).filter(
    (piece) => piece.color === "blue",
  );
  const whitePieces = Object.values(piecesSelection.pieces).filter(
    (piece) => piece.color === "white",
  );
  const pieceGap = 16;
  const pieceWidth = (width - pieceGap * 3) / 4;
  let scrollView: ScrollView | null;

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Modal
        style={{ flexDirection: "column" }}
        animationType="none"
        transparent={false}
        visible={menuOpened}
        onRequestClose={() => setMenuOpened(false)}
      >
        <SafeAreaView style={{ flex: 1, margin: 22 }}>
          <ScrollView
            ref={(ref) => {
              scrollView = ref;
            }}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 16 }}
            onContentSizeChange={() =>
              scrollView?.scrollToEnd({ animated: false })
            }
          >
            <View style={[styles.piecesContainer, styles.blueContainer]}>
              {bluePieces.map((piece) => {
                return (
                  <Piece
                    contentContainerStyle={{ width: pieceWidth, gap: 0 }}
                    key={`${piece.pieceName}-${piece.color}`}
                    pieceSelection={piece}
                    width={pieceWidth}
                    onPressOut={() => {
                      setMenuOpened(false);
                      onSelection(piece);
                    }}
                  />
                );
              })}
            </View>
            <View style={[styles.piecesContainer, styles.whiteContainer]}>
              {whitePieces.map((pieceSelection) => {
                return (
                  <Piece
                    contentContainerStyle={{ width: pieceWidth, gap: 0 }}
                    key={`${pieceSelection.pieceName}-${pieceSelection.color}`}
                    pieceSelection={pieceSelection}
                    width={pieceWidth}
                    onPressOut={() => {
                      setMenuOpened(false);
                      onSelection(pieceSelection);
                    }}
                  />
                );
              })}
            </View>
          </ScrollView>

          <View style={[styles.actions, { paddingBottom: insets.bottom }]}>
            <Pressable
              style={[styles.button, styles.buttonReturn]}
              onPress={() => setMenuOpened(false)}
            >
              <Text style={styles.buttonText}>Back to game</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={[styles.actions, { width, paddingBottom: insets.bottom }]}>
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
    margin: 22,
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
    justifyContent: "space-around",
    flexWrap: "wrap",
    borderRadius: 15,
    padding: 11,
    gap: 16,
  },
  button: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 20,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 22,
  },
  buttonOpen: {
    backgroundColor: "#B5BEC8",
    borderColor: "#526172",
  },
  buttonReturn: {
    backgroundColor: "#B5BEC8",
    borderColor: "#424D5B",
  },
  actions: {
    justifyContent: "flex-end",
    paddingTop: 16,
  },
});
