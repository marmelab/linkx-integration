import type { ReactNode } from "react";

import { FieldTitle, useRecordContext } from "ra-core";

type GameStatusFieldProps = {
  label?: ReactNode;
};

export default function GameStatusField({ label }: GameStatusFieldProps) {
  const record = useRecordContext();
  if (!record || !record.status) {
    return null;
  }

  const value = transformStatusForDisplay(record.status);

  return (
    <div>
      {label ? (
        <div className="text-muted-foreground text-xs">
          <FieldTitle label={label}></FieldTitle>
        </div>
      ) : null}
      <span>{value}</span>
    </div>
  );
}

function transformStatusForDisplay(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).replaceAll("_", " ");
}
