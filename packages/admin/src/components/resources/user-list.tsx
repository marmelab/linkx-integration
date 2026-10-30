import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";

export const UserList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="username" />
      <DataTable.Col source="roles" />
      <DataTable.Col source="displayName" />
    </DataTable>
  </List>
);
