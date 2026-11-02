import { DateField } from "@/components/admin";
import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { RolesField } from "@/components/admin/roles-field";
import { getClientTimezone } from "@/lib/get-client-timezone";

export const UserList = () => {
  const timeZone = getClientTimezone();
  return (
    <List>
      <DataTable>
        <DataTable.Col source="id" />
        <DataTable.Col source="displayName" />
        <DataTable.Col source="username" />
        <DataTable.Col source="email" />
        <DataTable.Col source="roles">
          <RolesField />
        </DataTable.Col>
        <DataTable.Col source="createdAt">
          <DateField
            source="createdAt"
            options={{
              timeZone,
            }}
          />
        </DataTable.Col>
        <DataTable.Col source="updatedAt">
          <DateField
            source="updatedAt"
            showTime={true}
            options={{
              timeZone,
            }}
          />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};
