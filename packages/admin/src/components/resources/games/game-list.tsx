import { DateField, ReferenceField } from "@/components/admin";
import { DataTable } from "@/components/admin/data-table";
import GameStatusField from "@/components/admin/game-status-field";
import { List, type ListProps } from "@/components/admin/list";
import { getClientTimezone } from "@/lib/get-client-timezone";

interface GameListProps extends ListProps {}

export const GameList = ({ ...props }: GameListProps) => (
  <List {...props}>
    <GameDataTable />
  </List>
);

export const GameDataTable = () => {
  const timeZone = getClientTimezone();

  return (
    <DataTable>
      <DataTable.Col label="First player" source="firstPlayer.displayName">
        <ReferenceField source="firstPlayer.id" reference="users" />
      </DataTable.Col>
      <DataTable.Col label="Second player" source="secondPlayer.displayName">
        <ReferenceField source="secondPlayer.id" reference="users" />
      </DataTable.Col>
      <DataTable.Col source="status">
        <GameStatusField />
      </DataTable.Col>
      <DataTable.Col label="Winner" source="victor.displayName">
        <ReferenceField source="victor.id" reference="users" />
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
  );
};
