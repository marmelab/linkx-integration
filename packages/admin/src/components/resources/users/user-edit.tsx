import { required, useRecordContext } from "ra-core";

import { DateTimeInput } from "@/components/admin";
import { Edit } from "@/components/admin/edit";
import { RolesField } from "@/components/admin/roles-field";
import { SimpleForm } from "@/components/admin/simple-form";
import { TextInput } from "@/components/admin/text-input";

const UserEditTitle = () => {
  const record = useRecordContext();
  return <span>Edit {record ? record.displayName : "user"}</span>;
};

export const UserEdit = () => {
  return (
    <Edit title={<UserEditTitle />}>
      <SimpleForm>
        <TextInput source="displayName" validate={required()} />
        <TextInput source="username" validate={required()} />
        <TextInput source="email" validate={required()} />
        <RolesField label="Roles" />
        <DateTimeInput source="createdAt" disabled />
        <DateTimeInput source="updatedAt" disabled />
      </SimpleForm>
    </Edit>
  );
};
