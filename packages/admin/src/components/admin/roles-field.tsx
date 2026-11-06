import type { ReactNode } from "react";

import { FieldTitle, useRecordContext } from "ra-core";

import { ROLES, type Role } from "@/token-auth-provider";

import { Badge } from "../ui/badge";

type RolesFieldProps = {
  label?: ReactNode;
};

export const RolesField = ({ label }: RolesFieldProps) => {
  const record = useRecordContext();
  if (!record || !record.roles) {
    return null;
  }

  return (
    <div>
      {label ? (
        <div className="text-muted-foreground text-xs">
          <FieldTitle label={label}></FieldTitle>
        </div>
      ) : null}
      {record.roles.map((role: Role) => (
        <Badge key={role}>{ROLES[role]}</Badge>
      ))}
    </div>
  );
};
