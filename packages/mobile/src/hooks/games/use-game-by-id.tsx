import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { showGame } from "@/api/api-games";
import { getPieceKey } from "@/helper/get-piece-key";

export function useGameById(id: string, refetch: boolean) {
  const { isRefetching, isPending, error, data } = useQuery({
    queryKey: ["game", id],
    queryFn: () => showGame(id),
    refetchInterval: refetch ? 1500 : false,
  });

  const mappedPieces = useMemo(
    () =>
      data?.game?.availablePieces.reduce((mapped, piece) => {
        return {
          ...mapped,
          [getPieceKey(piece.color, piece.piece)]: piece,
        };
      }, {}),
    [data?.game.id],
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
