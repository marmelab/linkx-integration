import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { getClientTimezone } from "@/lib/get-client-timezone";

import { DateField } from "../admin";
import { RolesField } from "../admin/roles-field";

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
            options={{
              timeZone,
            }}
          />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};
