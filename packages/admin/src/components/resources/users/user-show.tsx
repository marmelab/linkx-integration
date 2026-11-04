import { ResourceContext, useRecordContext } from "ra-core";

import { DateField } from "@/components/admin/date-field";
import { RecordField } from "@/components/admin/record-field";
import { RolesField } from "@/components/admin/roles-field";
import { Show } from "@/components/admin/show";

import { GameList } from "../games/game-list";

const UserShowTitle = () => {
  const record = useRecordContext();
  return <span>{record ? record.displayName : "User"}</span>;
};

export const UserShow = () => {
  return (
    <Show title={<UserShowTitle />}>
      <div className="flex flex-col gap-4">
        <RecordField source="displayName" />
        <RecordField source="username" />
        <RecordField source="email" />
        <RolesField label="Roles" />
        <RecordField source="createdAt">
          <DateField source="createdAt" />
        </RecordField>
        <RecordField source="updatedAt">
          <DateField source="updatedAt" />
        </RecordField>
        <ResourceContext value="games">
          <PlayerGameList />
        </ResourceContext>
      </div>
    </Show>
  );
};

const PlayerGameList = () => {
  const record = useRecordContext();
  const filter = record ? { playerId: record.id } : {};
  return (
    <GameList
      filter={filter}
      perPage={5}
      sort={{ field: "updatedAt", order: "DESC" }}
      title="Games played"
    />
  );
};
