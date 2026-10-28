import { useGameById } from "./use-game-by-id";
import { usePlayTurnMutation } from "./use-play-turn-mutation";

export function useIsGameLoading(id: number): { isLoading: boolean } {
  const { isPending } = useGameById(id.toString());
  const playTurnMutation = usePlayTurnMutation(id);

  return { isLoading: isPending || playTurnMutation.isPending };
}
