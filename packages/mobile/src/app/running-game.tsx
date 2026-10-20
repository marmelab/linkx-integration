import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { RunningGameContext } from "@/context/RunningGameContext";

export default function RunningGameDisplay() {
  const game = null; // TODO

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.gameWrapper}>
          <RunningGameContext value={game}></RunningGameContext>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    gap: Spacing.two,
  },
  gameWrapper: {
    flex: 1,
  },
});
