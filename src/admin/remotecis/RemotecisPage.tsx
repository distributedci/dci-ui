import { useEffect, useState } from "react";
import { EmptyState, Breadcrumb } from "ui";
import {
  Content,
  PageSection,
  Pagination,
  SearchInput,
  Skeleton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import type { Filters } from "types";
import { useLocation, useNavigate } from "react-router";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "services/filters";

import LoadingPageSection from "ui/LoadingPageSection";
import { useAuth } from "auth/authSelectors";
import { useListRemotecisQuery } from "remotecis/remotecisApi";
import RemotecisAdminTable from "./RemotecisAdminTable";

function RemotecisList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, { state: null }),
  );
  const [inputSearch, setInputSearch] = useState(filters.name || "");

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/admin/remotecis${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading, isFetching } = useListRemotecisQuery(filters);

  const setFiltersAndResetPagination = (f: Partial<Filters>) => {
    setFilters({
      ...filters,
      ...f,
      offset: 0,
    });
  };

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return <EmptyState title="There is no remotecis" />;
  }

  const remotecisCount = data._meta.count;
  return (
    <div>
      <Toolbar id="toolbar-remotecis" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Search a remoteci"
                value={inputSearch}
                onChange={(_, search) => setInputSearch(search)}
                onSearch={(_, name) => {
                  if (name.trim().endsWith("*")) {
                    setFiltersAndResetPagination({ name });
                  } else {
                    setFiltersAndResetPagination({ name: `${name}*` });
                  }
                }}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup style={{ flex: "1" }}>
            <ToolbarItem variant="pagination" align={{ default: "alignEnd" }}>
              {remotecisCount === 0 ? null : (
                <Pagination
                  perPage={filters.limit}
                  page={offsetAndLimitToPage(filters.offset, filters.limit)}
                  itemCount={remotecisCount}
                  onSetPage={(_, newPage) => {
                    setFilters({
                      ...filters,
                      offset: pageAndLimitToOffset(newPage, filters.limit),
                    });
                  }}
                  onPerPageSelect={(_, newPerPage) => {
                    setFilters({ ...filters, limit: newPerPage });
                  }}
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {isFetching ? (
        <Skeleton />
      ) : data.remotecis.length === 0 ? (
        inputSearch === "" ? (
          <EmptyState
            title="There is no remotecis"
            info="Do you want to create one?"
          />
        ) : (
          <EmptyState
            title="There is no remotecis"
            info="There is no remotecis matching your search. Please update your search."
          />
        )
      ) : (
        <RemotecisAdminTable remotecis={data.remotecis} />
      )}
    </div>
  );
}

export default function AdminRemotecisPage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <>
      <PageSection>
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Admin Remotecis" }]}
        />
        <Content component="h1">Remotecis</Content>
        <RemotecisList />
      </PageSection>
    </>
  );
}
