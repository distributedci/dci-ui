import {
  ToolbarItem,
  TextInput,
  Button,
  ToolbarGroup,
  ToolbarFilter,
  Form,
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
  const formId = "query-language-form";
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
          <Form
            id={formId}
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(value);
            }}
          >
            <TextInput
              value={value}
              type="text"
              onChange={(value) => setValue(value)}
              placeholder="Query language search"
              aria-label="query language search input"
              style={{ minWidth: "380px" }}
            />
          </Form>
        </ToolbarFilter>
      </ToolbarItem>
      <ToolbarItem>
        <Button variant="secondary" type="submit" form={formId}>
          Search
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
  );
}
