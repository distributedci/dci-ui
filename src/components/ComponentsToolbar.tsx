import {
  Dropdown,
  DropdownItem,
  DropdownList,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { useState } from "react";
import {
  getDefaultFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
} from "@/services/filters";
import { Filters } from "@/types";
import ListToolbarFilter from "jobs/toolbar/ListToolbarFilter";
import TextInputToolbarFilter from "jobs/toolbar/TextInputToolbarFilter";

const Categories = ["Name", "Type", "Tag"] as const;

type Category = (typeof Categories)[number];

export default function ComponentsToolbar({
  nbOfComponents,
  filters,
  setFilters,
}: {
  nbOfComponents: number;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Categories[0],
  );

  function clearAllFilters() {
    setCurrentCategory(Categories[0]);
    setFilters(getDefaultFilters());
  }

  return (
    <Toolbar
      id="toolbar-components"
      collapseListedFiltersBreakpoint="xl"
      clearAllFilters={clearAllFilters}
    >
      <ToolbarContent>
        <ToolbarGroup>
          <InputGroup>
            <InputGroupItem>
              <Dropdown
                isOpen={isCategoryDropdownOpen}
                onSelect={(_event, index) => {
                  if (index !== undefined) {
                    setCurrentCategory(Categories[index as number]);
                  }
                }}
                onOpenChange={(isOpen: boolean) =>
                  setIsCategoryDropdownOpen(isOpen)
                }
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
                    isExpanded={isCategoryDropdownOpen}
                  >
                    {currentCategory}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem value={0} key="Name">
                    Name
                  </DropdownItem>
                  <DropdownItem value={1} key="Type">
                    Type
                  </DropdownItem>
                  <DropdownItem value={2} key="Tag">
                    Tag
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </InputGroupItem>
            <InputGroupItem isFill>
              <TextInputToolbarFilter
                showToolbarItem={currentCategory === "Name"}
                categoryName="Name"
                value={filters.display_name}
                onSubmit={(display_name) => {
                  if (display_name.trim().endsWith("*")) {
                    setFilters({
                      ...filters,
                      display_name,
                    });
                  } else {
                    setFilters({
                      ...filters,
                      display_name: `${display_name}*`,
                    });
                  }
                }}
                onClear={() => setFilters({ ...filters, display_name: null })}
              />
              <TextInputToolbarFilter
                showToolbarItem={currentCategory === "Type"}
                categoryName="Type"
                value={filters.type}
                onSubmit={(type) => setFilters({ ...filters, type })}
                onClear={() => setFilters({ ...filters, type: null })}
              />
              <ListToolbarFilter
                showToolbarItem={currentCategory === "Tag"}
                categoryName="Tag"
                placeholderText="Search by tag"
                items={filters.tags ?? []}
                onSubmit={(tags) => setFilters({ ...filters, tags })}
              />
            </InputGroupItem>
          </InputGroup>
        </ToolbarGroup>
        <ToolbarGroup style={{ flex: "1" }}>
          <ToolbarItem variant="pagination" align={{ default: "alignEnd" }}>
            {nbOfComponents === 0 ? null : (
              <Pagination
                perPage={filters.limit}
                page={offsetAndLimitToPage(filters.offset, filters.limit)}
                itemCount={nbOfComponents}
                onSetPage={(e, newPage) => {
                  setFilters({
                    ...filters,
                    offset: pageAndLimitToOffset(newPage, filters.limit),
                  });
                }}
                onPerPageSelect={(e, newPerPage) => {
                  setFilters({ ...filters, limit: newPerPage });
                }}
              />
            )}
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
}
