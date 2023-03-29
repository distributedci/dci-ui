import {
  ToolbarItem,
  SearchInput,
  Button,
  ToolbarGroup,
  ToolbarFilter,
} from "@patternfly/react-core";
import { useState } from "react";

export default function QLToolbar({
  query,
  onSearch,
  onClear,
  showToolbarItem = true,
}: {
  query: string | null;
  onSearch: (search: string | null) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
}) {
  const [value, setValue] = useState(query || "");
  return (
    <ToolbarGroup variant="button-group">
      <ToolbarItem>
        <ToolbarFilter
          chips={query === null ? [] : [query]}
          deleteChip={() => {
            setValue("");
            onClear();
          }}
          categoryName="Query"
          showToolbarItem={showToolbarItem}
        >
          <SearchInput
            value={value}
            type="text"
            onChange={(value) => setValue(value)}
            placeholder="Query language search"
            aria-label="query language search input"
            style={{ minWidth: "380px" }}
          />
        </ToolbarFilter>
      </ToolbarItem>
      <ToolbarItem>
        <Button
          variant="secondary"
          onClick={() => {
            onSearch(value);
          }}
        >
          Search
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
  );
}
