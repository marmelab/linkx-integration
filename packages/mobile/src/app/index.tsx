import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "../global.css";

import Games from "@/components/games";

export default function Index() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <QueryClientProvider client={queryClient}>
          <Games />
        </QueryClientProvider>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
