import { required } from "ra-core";

import { DateTimeInput } from "@/components/admin";
import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";
import { TextInput } from "@/components/admin/text-input";

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="username" validate={required()} />
      <TextInput source="roles" disabled />
      <TextInput source="displayName" validate={required()} />
      <TextInput source="email" validate={required()} />
      <DateTimeInput source="createdAt" disabled />
      <DateTimeInput source="updatedAt" disabled />
    </SimpleForm>
  </Edit>
);
