import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Move } from "@/model/move";

import { playTurn } from "@/api/api-games";

export type PlayTurnParams = { gameId: number; move: Move };

export function usePlayTurnMutation(gameId: number) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ gameId, move }: PlayTurnParams) => playTurn(gameId, move),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["game", gameId] }),
  });

  return mutation;
}
