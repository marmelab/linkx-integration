import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

import type { Move } from "@/model/move";

import { playTurn } from "@/api/api-games";

export type PlayTurnParams = { gameId: number; move: Move };

export function usePlayTurnMutation() {
  const mutation = useMutation({
    mutationFn: ({ gameId, move }: PlayTurnParams) => playTurn(gameId, move),
  });

  return useMemo(() => ({ mutation }), [mutation]);
}
