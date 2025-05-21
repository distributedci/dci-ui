import { useState } from "react";
import { ToolbarFilter } from "@patternfly/react-core";
import TextInput from "./TextInput";

type ListToolbarFilterProps = {
  showToolbarItem?: boolean;
  items: string[];
  categoryName: string;
  placeholderText: string;
  onSubmit: (items: string[]) => void;
};

/**
 * Remove a specified chip from a list of items, ensuring unique items first.
 * @param items - original list of items (may contain duplicates)
 * @param chip - item to remove
 * @returns new list without the removed chip
 */
export function deleteListItem(items: string[], chip: string): string[] {
  const uniqItems = [...new Set(items)];
  return uniqItems.filter((f) => f !== chip);
}

export default function ListToolbarFilter({
  showToolbarItem = true,
  items,
  onSubmit,
  categoryName,
}: ListToolbarFilterProps) {
  const [value, setValue] = useState("");
  const uniqItems = [...new Set(items)];
  return (
    <ToolbarFilter
      labels={uniqItems}
      deleteLabel={(_category, chip) => onSubmit(deleteListItem(items, chip))}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TextInput
        value={value}
        name={categoryName.toLowerCase()}
        onClick={(newValue) => {
          if (uniqItems?.indexOf(newValue) === -1) {
            onSubmit(uniqItems.concat(newValue));
            setValue("");
          }
        }}
      />
    </ToolbarFilter>
  );
}
