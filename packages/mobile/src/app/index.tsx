import { Host } from "@expo/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GameList from "@/components/game-list";

export default function Index() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaView>
      <Host style={styles.container}>
        <QueryClientProvider client={queryClient}>
          <GameList />
        </QueryClientProvider>
      </Host>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gameListElement: {},
});
