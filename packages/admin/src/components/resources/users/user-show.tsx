import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { RecordField } from "@/components/admin/record-field";
import { RolesField } from "@/components/admin/roles-field";
import { Show } from "@/components/admin/show";

export const UserShow = () => (
  <Show>
    <div className="flex flex-col gap-4">
      <RecordField source="id">
        <NumberField source="id" />
      </RecordField>
      <RecordField source="username" />
      <RecordField source="displayName" />
      <RolesField label="Roles" />
      <RecordField source="email" />
      <RecordField source="createdAt">
        <DateField source="createdAt" />
      </RecordField>
      <RecordField source="updatedAt">
        <DateField source="updatedAt" />
      </RecordField>
    </div>
  </Show>
);
