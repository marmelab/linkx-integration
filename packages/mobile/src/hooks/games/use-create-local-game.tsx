import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import { createGame } from "@/api/api-games";

import { useSetLastLocalGameId } from "./storage/use-set-last-local-game-id";

export function useCreateLocalGame() {
  const mutation = useMutation({
    mutationFn: (additionalOptions: object) =>
      createGame({
        ...additionalOptions,
        local: true,
      }),
    onSuccess: (data) => {
      const setLastLocalGameId = useSetLastLocalGameId();
      setLastLocalGameId.mutate(data.id.toString());
      router.navigate({
        pathname: "/game/[id]",
        params: {
          id: data.id,
          mode: "playing-local",
        },
      });
    },
  });

  return mutation;
}
