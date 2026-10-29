import type { ViewProps } from "react-native";

import { useContext, useState } from "react";
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

import { RunningGameContext } from "@/context/running-game-context";
import { primary } from "@/style-constants";

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
  const game = useContext(RunningGameContext);

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
              {bluePieces.map((pieceSelection) => (
                <InlinePiece
                  key={`${pieceSelection.pieceName}-${pieceSelection.color}`}
                  onPressOut={() => {
                    if (game?.turnOfPlayer === pieceSelection.color) {
                      setMenuOpened(false);
                      onSelection(pieceSelection);
                    }
                  }}
                  width={pieceWidth}
                  pieceSelection={pieceSelection}
                />
              ))}
            </View>
            <View style={[styles.piecesContainer, styles.whiteContainer]}>
              {whitePieces.map((pieceSelection) => (
                <InlinePiece
                  key={`${pieceSelection.pieceName}-${pieceSelection.color}`}
                  onPressOut={() => {
                    if (game?.turnOfPlayer === pieceSelection.color) {
                      setMenuOpened(false);
                      onSelection(pieceSelection);
                    }
                  }}
                  width={pieceWidth}
                  pieceSelection={pieceSelection}
                />
              ))}
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

interface InlinePieceProps extends ViewProps {
  width: number;
  pieceSelection: PieceSelection;
  onPressOut: (piece: PieceSelection) => void;
}

const InlinePiece = ({
  width,
  pieceSelection,
  onPressOut,
  ...props
}: InlinePieceProps) => (
  <View {...props} style={{ flex: 0 }}>
    <Piece
      contentContainerStyle={{ width }}
      pieceSelection={pieceSelection}
      width={width}
      onPressOut={onPressOut}
    />
  </View>
);

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
    margin: 11,
    gap: 8,
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
    backgroundColor: primary[300],
    borderColor: primary[700],
  },
  buttonReturn: {
    backgroundColor: primary[300],
    borderColor: primary[700],
  },
  actions: {
    justifyContent: "flex-end",
    paddingTop: 16,
  },
});
