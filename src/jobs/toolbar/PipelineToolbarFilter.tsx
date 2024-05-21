import { ToolbarFilter } from "@patternfly/react-core";
import { IPipeline, SelectProps } from "types";

export default function PipelineToolbarFilter({
  id,
  showToolbarItem = true,
  onClear,
}: SelectProps<IPipeline>) {
  return (
    <ToolbarFilter
      chips={id ? [id] : []}
      categoryName="Pipeline id"
      deleteChip={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      {null}
    </ToolbarFilter>
  );
}
