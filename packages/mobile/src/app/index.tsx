import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Games from "@/components/games";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Games />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
});
