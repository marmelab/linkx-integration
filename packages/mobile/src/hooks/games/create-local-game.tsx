import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

import { createGame } from "@/api-games";

export function useCreateLocalGame() {
  const mutation = useMutation({
    mutationFn: (additionalOptions: object) =>
      createGame({
        ...additionalOptions,
        local: true,
      }),
  });

  return useMemo(() => ({ mutation }), [mutation]);
}
