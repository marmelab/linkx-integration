import { useQuery } from "@tanstack/react-query";

import { showGame } from "@/api/api-games";
import { getPieceKey } from "@/helper/get-piece-key";

export function useGameById(id: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["game", id],
    queryFn: () => showGame(id),
    refetchInterval: 1500,
  });

  const mappedPieces = data?.game?.availablePieces.reduce((mapped, piece) => {
    return {
      ...mapped,
      [getPieceKey(piece.color, piece.piece)]: piece,
    };
  }, {});

  return {
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
