import type { Validator } from "ra-core";

import { ROLES } from "@/token-auth-provider";

import { AutocompleteInput } from "./autocomplete-input";

interface RolesInputProps {
  source: string;
  validate?: Validator | Validator[];
}

const choices = Object.entries(ROLES).map(([key, value]) => ({
  id: key,
  name: value,
}));

export const RolesInput = ({ ...props }: RolesInputProps) => {
  return (
    <AutocompleteInput
      {...props}
      format={(roles) => roles[0]}
      parse={(choice) => [choice]}
      choices={choices}
    />
  );
};
