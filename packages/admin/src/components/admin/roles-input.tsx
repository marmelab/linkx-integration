import type { Validator } from "ra-core";

import { AutocompleteInput } from "./autocomplete-input";

interface RolesInputProps {
  source: string;
  validate?: Validator | Validator[];
}

export const RolesInput = ({ ...props }: RolesInputProps) => {
  return (
    <AutocompleteInput
      {...props}
      format={(roles) => {
        console.log("format", roles);
        return roles[0];
      }}
      parse={(choice) => {
        console.log("parse", choice);
        return [choice];
      }}
      choices={[
        { id: "ROLE_USER", name: "Player" },
        { id: "ROLE_USER_MANAGER", name: "Player Manager" },
        { id: "ROLE_ADMIN", name: "Administrator" },
        // For now, you can select only one role.
      ]}
    />
  );
};
