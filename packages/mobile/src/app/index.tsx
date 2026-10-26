import type { UseMutationResult } from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GamesList from "@/components/game-list";
import { useCreateLocalGame } from "@/hooks/games/create-local-game";

export default function Index() {
  const createGameMutation = useCreateLocalGame().mutation;
  const [currentGameId, setCurrentGameId] = useState<string | null | undefined>(
    null,
  );

  useEffect(() => {
    AsyncStorage.getItem("runningGameId")
      .then((id) => {
        console.log(id);
        setCurrentGameId(id);
      })
      .catch((error) => console.error(error));
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {createGameMutation.error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {createGameMutation.error.message}
            </Text>
          </View>
        ) : (
          <View style={styles.noErrorPadding} />
        )}
        <Pressable
          style={styles.newGameButton}
          onPress={() => createThenRedirect(createGameMutation)}
          disabled={createGameMutation.isPending}
        >
          <MaterialDesignIcons
            name={createGameMutation.isPending ? "loading" : "plus"}
            color={"#2C6C2F"}
            size={50}
          />
        </Pressable>

        <GamesList currentGameId={currentGameId} />
      </View>
    </SafeAreaView>
  );
}

function createThenRedirect(
  createGameMutation: UseMutationResult<
    {
      id: number;
    },
    Error,
    object,
    unknown
  >,
) {
  createGameMutation.mutate(
    {},
    {
      onSuccess: (data) => {
        AsyncStorage.setItem("runningGameId", data.id.toString())
          .then(() => {
            console.log(data.id);
          })
          .catch((error) => {
            console.error(error);
          });
        router.navigate({
          pathname: "/game/[id]",
          params: {
            id: data.id,
            mode: "playing-local",
          },
        });
      },
    },
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 30,
    marginLeft: 22,
    marginRight: 22,
    paddingTop: 18,
  },
  errorText: {
    color: "#9C4438",
  },
  errorContainer: {
    height: 60,
    backgroundColor: "#FFC8C0",
    borderWidth: 1,
    borderColor: "#9C4438",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  noErrorPadding: {
    height: 60,
  },
  newGameButton: {
    borderColor: "#2C6C2F",
    backgroundColor: "#D9F5DA",
    borderWidth: 3,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 38,
    paddingBottom: 38,
  },
});
