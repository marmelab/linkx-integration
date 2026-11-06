import type { Identifier } from "ra-core";

import { useSubscribeToRecord } from "@react-admin/ra-core-ee";
import { useShowContext } from "ra-core";
import { useCallback } from "react";

export const RecordLiveUpdate = (props: RecordLiveUpdateProps) => {
  const { refetch } = useShowContext();
  const handleUpdate = useCallback(() => {
    refetch().catch((error) => console.error(error));
  }, [refetch]);

  useSubscribeToRecord(handleUpdate, props.resource, props.id);

  return null;
};

type RecordLiveUpdateProps = {
  resource?: string;
  id?: Identifier;
};
