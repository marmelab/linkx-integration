import { FieldTitle, required, useRecordContext } from "ra-core";

import { DateTimeInput } from "@/components/admin";
import { Edit } from "@/components/admin/edit";
import { RolesField } from "@/components/admin/roles-field";
import { RolesInput } from "@/components/admin/roles-input";
import { SimpleForm } from "@/components/admin/simple-form";
import { TextInput } from "@/components/admin/text-input";
import { PAYLOAD_KEY, ROLE_ADMIN } from "@/token-auth-provider";

const UserEditTitle = () => {
  const record = useRecordContext();
  return <span>Edit {record ? record.displayName : "user"}</span>;
};

export const UserEdit = () => {
  const tokenPayload = localStorage.getItem(PAYLOAD_KEY);
  const isAdmin = tokenPayload
    ? JSON.parse(tokenPayload).roles?.includes(ROLE_ADMIN)
    : false;

  return (
    <Edit title={<UserEditTitle />}>
      <SimpleForm>
        <TextInput source="displayName" validate={required()} />
        <TextInput source="username" validate={required()} />
        <TextInput source="email" validate={required()} />
        {isAdmin ? (
          <RolesInput source="roles" validate={required()} />
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm leading-none font-medium select-none">
              <FieldTitle label="Roles" />
            </div>
            <RolesField />
          </>
        )}
        <DateTimeInput source="createdAt" disabled />
        <DateTimeInput source="updatedAt" disabled />
      </SimpleForm>
    </Edit>
  );
};
