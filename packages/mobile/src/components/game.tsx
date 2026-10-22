import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native";

import type { GameModel, PieceModel } from "@/model/game";

import { showGame } from "@/api";

export default function Game(param: any) {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["game"],
    queryFn: () => showGame(param.id),
  });

  useEffect(() => {
    const timer = setInterval(
      () => queryClient.invalidateQueries({ queryKey: ["game"] }),
      1,
    );
    return () => clearInterval(timer);
  }, []);

  if (isPending) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Loading game...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Error : couldn't fetch game.</Text>
      </View>
    );
  }

  const game = data.game as GameModel;
  const gameTitle = `${game.firstPlayer?.displayName ?? "Unknown player"} VS ${game.secondPlayer?.displayName ?? "Unknown player"}`;
  return (
    <View style={styles.game}>
      <Text style={styles.heading}>{gameTitle}</Text>
      {GameLabel(game)}
      {Grid(game.grid)}
      {PiecesLeft(game.availablePieces)}
    </View>
  );
}

function GameLabel(game: any) {
  let label = "Game in progress";
  return <Text style={styles.subHeading}>{label}</Text>; // TODO
}

function Grid(grid: string[][]) {
  const cells = [];

  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x <= grid.length - 1; x++) {
      cells.push({
        value: grid[x][y],
        x: x,
        y: y,
      });
    }
  }

  return (
    <FlatList
      data={cells}
      style={styles.grid}
      renderItem={(item: any) => Cell(item.item.value)}
      keyExtractor={(item) => `${item.x}.${item.y}`}
      numColumns={9}
    />
  );
}

function Cell(cellValue: string) {
  switch (cellValue) {
    case "white":
    case "whiteLastMove":
      return <View style={styles.cellWhite}></View>;
    case "blue":
    case "blueLastMove":
      return <View style={styles.cellBlue}></View>;
    case ".":
    default:
      return <View style={styles.emptyCell}></View>;
  }
}

function PiecesLeft(availablePieces: PieceModel[]) {
  // TODO Carousel
  return (
    <View>
      <ScrollView horizontal>
        {availablePieces.map((piece) => Piece(piece))}
      </ScrollView>
    </View>
  );
}

function Piece(piece: PieceModel) {
  const cells = [];

  const selectedMatrix = piece.possibleMatrices.find((possibleMatrix) => {
    return possibleMatrix.mirrored.includes();
  })?.matrix;

  for (let y = 2; y >= 0; y--) {
    for (let x = 0; x <= 2; x++) {
      cells.push({
        value: selectedMatrix[x][y],
        x: x,
        y: y,
      });
    }
  }

  const key = `${piece.piece}-${piece.color}`;
  return (
    <TouchableOpacity>
      <Text key={key}>{piece.piece}</Text>
    </TouchableOpacity>
  );
}

const borderColor = "#333";
const styles = StyleSheet.create({
  game: {
    flex: 1,
  },
  grid: {
    flex: 1,
    marginTop: 18,
    marginBottom: 18,
  },
  heading: {
    textAlign: "center",
    fontSize: 26,
  },
  subHeading: {
    textAlign: "center",
    fontSize: 20,
    color: "#666",
  },
  cellWhite: {
    flex: 1,
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#9C4438",
  },
  cellBlue: {
    flex: 1,
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#006596",
  },
  emptyCell: {
    flex: 1,
    aspectRatio: 1,
    borderColor: borderColor,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});
