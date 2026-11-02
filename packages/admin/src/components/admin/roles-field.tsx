import type { ReactNode } from "react";

import { FieldTitle, useRecordContext } from "ra-core";

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
      {record.roles.map((role: string) => (
        <Badge key={role}>{transformRoleForDisplay(role)}</Badge>
      ))}
    </div>
  );
};

const transformRoleForDisplay = (role: string) => {
  if (role === "ROLE_USER") return "Player";
  if (role === "ROLE_ADMIN") return "Administrator";
  return role;
};
