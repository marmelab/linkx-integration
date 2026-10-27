import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

export function useLastLocalGameId() {
  return useQuery({
    queryKey: ["last-game-id"],
    queryFn: () => AsyncStorage.getItem("runningGameId"),
  });
}
