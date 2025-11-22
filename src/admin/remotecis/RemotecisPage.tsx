import { useEffect, useState } from "react";
import { CopyButton, EmptyState, Breadcrumb } from "ui";
import {
  Content,
  Label,
  PageSection,
  Pagination,
  SearchInput,
  Skeleton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import type { Filters, IRemoteci } from "types";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  type IAction,
} from "@patternfly/react-table";
import { useLocation, useNavigate } from "react-router";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "services/filters";

import { fromNow } from "services/date";
import LoadingPageSection from "ui/LoadingPageSection";
import { useAuth } from "auth/authSelectors";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import {
  useDeactivateRemoteciMutation,
  useListRemotecisQuery,
  useReactivateRemoteciMutation,
} from "remotecis/remotecisApi";

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

  const [reactivateRemoteci] = useReactivateRemoteciMutation();
  const [deactivateRemoteci] = useDeactivateRemoteciMutation();

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

  const buildRemoteciActions = (remoteci: IRemoteci): IAction[] => {
    const actions: IAction[] = [];
    if (remoteci.state === "active") {
      actions.push({
        title: (
          <span style={{ color: t_global_color_status_danger_default.var }}>
            Deactivate
          </span>
        ),
        onClick: () => deactivateRemoteci(remoteci),
      });
    } else {
      actions.push({
        title: "Reactivate",
        onClick: () => reactivateRemoteci(remoteci),
      });
    }
    return actions;
  };

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
        <Table>
          <Thead>
            <Tr>
              <Th className="text-center">ID</Th>
              <Th>Name</Th>
              <Th className="text-center">Status</Th>
              <Th className="text-center">Team</Th>
              <Th>Last auth</Th>
              <Th>Created</Th>
              <Th className="text-center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.remotecis.map((remoteci) => {
              const remoteciActions = buildRemoteciActions(remoteci);
              return (
                <Tr key={`${remoteci.id}.${remoteci.etag}`}>
                  <Td isActionCell>
                    <CopyButton text={remoteci.id} />
                  </Td>
                  <Td>{remoteci.name}</Td>
                  <Td className="text-center">
                    {remoteci.state === "active" ? (
                      <Label color="green">active</Label>
                    ) : (
                      <Label color="red">inactive</Label>
                    )}
                  </Td>
                  <Td className="text-center">{remoteci.team.name}</Td>
                  <Td></Td>
                  <Td>{fromNow(remoteci.created_at)}</Td>
                  <Td className="text-center">
                    <ActionsColumn items={remoteciActions} />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
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
