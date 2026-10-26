import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { showGame } from "@/api";

export function useGameById(id: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["game", id],
    queryFn: () => showGame(id),
    refetchInterval: 1500,
  });

  return useMemo(
    () => ({
      isPending,
      error,
      data,
    }),
    [isPending, error, data],
  );
}
