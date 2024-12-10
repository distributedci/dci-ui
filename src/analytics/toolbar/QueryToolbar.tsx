import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  TextInput,
  ButtonVariant,
  Icon,
} from "@patternfly/react-core";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RangeOptionValue } from "types";

import { ArrowRightIcon } from "@patternfly/react-icons";
import RangeSelect from "ui/form/RangeSelect";

interface QueryToolbarFilters {
  query: string;
  range: RangeOptionValue;
  after: string;
  before: string;
}

export default function QueryToolbar({
  onSearch,
}: {
  onSearch: (values: QueryToolbarFilters) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [range, setRange] = useState<RangeOptionValue>(
    searchParams.get("range") as RangeOptionValue,
  );
  const [after, setAfter] = useState(searchParams.get("after") || "");
  const [before, setBefore] = useState(searchParams.get("before") || "");

  return (
    <Toolbar id="toolbar-pipelines" style={{ paddingBlockEnd: 0 }}>
      <form
        id="toolbar-pipelines"
        onSubmit={(e) => {
          e.preventDefault();
          const params = {
            query,
            range,
            after,
            before,
          };
          setSearchParams(params);
          onSearch(params);
        }}
      >
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <TextInput
                value={query}
                type="text"
                onChange={(_event, value) => setQuery(value)}
                aria-label="input pipeline query"
                style={{ width: 380 }}
                placeholder="Filter job with query string"
              />
            </ToolbarItem>
            <ToolbarItem>
              <RangeSelect
                range={range}
                onChange={(range, after, before) => {
                  setRange(range);
                  setAfter(after);
                  setBefore(before);
                }}
                after={after}
                before={before}
                ranges={[
                  "last7Days",
                  "last30Days",
                  "last90Days",
                  "previousWeek",
                  "currentWeek",
                  "yesterday",
                  "today",
                  "custom",
                ]}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button
                type="submit"
                isDisabled={query === ""}
                variant={ButtonVariant.control}
                icon={
                  <Icon>
                    <ArrowRightIcon />
                  </Icon>
                }
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </form>
    </Toolbar>
  );
}
