import { useQuery } from "@tanstack/react-query";

import { showGame } from "@/api/api-games";
import { getPieceKey } from "@/helper/get-piece-key";

export function useGameById(id: string, refetch: boolean) {
  const { isRefetching, isPending, error, data } = useQuery({
    queryKey: ["game", id],
    queryFn: () => showGame(id),
    refetchInterval: refetch ? 1500 : false,
  });

  const mappedPieces = data?.game?.availablePieces.reduce(
    (mapped, piece) => ({
      ...mapped,
      [getPieceKey(piece.color, piece.piece)]: piece,
    }),
    {},
  );

  return {
    isRefetching,
    isPending,
    error,
    data: {
      game: {
        ...data?.game,
        mappedPieces,
      },
    },
  };
}
