import { useGetList } from "ra-core";

import { DateField, SearchInput } from "@/components/admin";
import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { RolesField } from "@/components/admin/roles-field";
import { CardTitle } from "@/components/ui/card";
import { getClientTimezone } from "@/lib/get-client-timezone";

const userListFilters = [<SearchInput source="q" alwaysOn />];

export const UserList = () => {
  const timeZone = getClientTimezone();

  return (
    <List title={<UserListTitle />} filters={userListFilters}>
      <DataTable>
        <DataTable.Col source="displayName" />
        <DataTable.Col source="username" />
        <DataTable.Col source="email" />
        <DataTable.Col disableSort source="roles">
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

const UserListTitle = () => {
  const { total } = useGetList("users");

  return (
    <CardTitle>
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Users</h2>
      <h3 className="text-muted-foreground text-l mb-2 tracking-tight">
        {total && total > 1 ? (
          <span>{total} users registered</span>
        ) : (
          <span>{total ?? "0"} user registered</span>
        )}
      </h3>
    </CardTitle>
  );
};
