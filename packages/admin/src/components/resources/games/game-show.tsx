import { ReferenceField } from "@/components/admin";
import { DateField } from "@/components/admin/date-field";
import GameStatusField from "@/components/admin/game-status-field";
import { RecordField } from "@/components/admin/record-field";
import { RecordLiveUpdate } from "@/components/admin/record-live-update";
import { Show } from "@/components/admin/show";

export const GameShow = () => (
  <Show>
    <div className="flex flex-col gap-4">
      <RecordField label="First player" source="firstPlayer.displayName">
        <ReferenceField source="firstPlayer.id" reference="users" />
      </RecordField>
      <RecordField label="Second player" source="secondPlayer.id">
        <ReferenceField source="secondPlayer.id" reference="users" />
      </RecordField>
      <GameStatusField label="Status" />
      <RecordField label="Winner" source="victor.displayName">
        <ReferenceField source="victor.id" reference="users" />
      </RecordField>
      <RecordField source="createdAt">
        <DateField source="createdAt" />
      </RecordField>
      <RecordField source="updatedAt">
        <DateField source="updatedAt" />
      </RecordField>
    </div>
    <RecordLiveUpdate />
  </Show>
);
