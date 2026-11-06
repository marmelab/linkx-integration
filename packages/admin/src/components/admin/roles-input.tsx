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
      format={(roles) => roles[0]}
      parse={(choice) => [choice]}
      choices={[
        { id: "ROLE_USER", name: "Player" },
        { id: "ROLE_USER_MANAGER", name: "Player Manager" },
        { id: "ROLE_ADMIN", name: "Administrator" },
        // For now, you can select only one role.
      ]}
    />
  );
};
