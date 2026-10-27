import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetLastLocalGameId() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      queryClient
        .invalidateQueries({ queryKey: ["last-game-id"] })
        .catch((error) => console.error(error));
      return AsyncStorage.setItem("runningGameId", id);
    },
  });
}
