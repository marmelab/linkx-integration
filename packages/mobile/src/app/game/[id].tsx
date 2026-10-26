import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Game from "@/components/game";

export default function GameRoute() {
  const { id } = useLocalSearchParams();

  const numberId = Array.isArray(id)
    ? Number.parseInt(id[0])
    : Number.parseInt(id);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Game
          key={`game-${numberId}`}
          onRequestClose={() => router.back()}
          id={numberId}
        />
      </View>
    </SafeAreaView>
  );
}
