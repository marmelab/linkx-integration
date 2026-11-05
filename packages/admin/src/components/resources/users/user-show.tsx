import { useRecordContext } from "ra-core";

import { ReferenceManyField } from "@/components/admin";
import { DateField } from "@/components/admin/date-field";
import { RecordField } from "@/components/admin/record-field";
import { RolesField } from "@/components/admin/roles-field";
import { Show } from "@/components/admin/show";

import { GameDataTable } from "../games/game-list";

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
        <ReferenceManyField
          sort={{ field: "updatedAt", order: "DESC" }}
          perPage={5}
          reference="games"
          target="playerId"
          queryOptions={{ refetchInterval: 10000 }}
        >
          <div className="text-2xl font-bold tracking-tight">Games played</div>
          <GameDataTable />
        </ReferenceManyField>
      </div>
    </Show>
  );
};
