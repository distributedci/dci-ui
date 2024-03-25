import { ToolbarFilter } from "@patternfly/react-core";
import RemoteciSelect from "./RemoteciSelect";
import { SelectProps } from "types";

export default function RemoteciToolbarFilter({
  id,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: SelectProps) {
  return (
    <ToolbarFilter
      chips={id ? [id] : []}
      categoryName="Remoteci id"
      deleteChip={() => onClear()}
    >
      <RemoteciSelect
        id={id}
        onSelect={onSelect}
        placeholder={placeholder}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
