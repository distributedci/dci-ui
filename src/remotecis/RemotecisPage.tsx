import { Fragment, useEffect, useState } from "react";
import { EmptyState, Breadcrumb, CopyIconButton } from "ui";
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
import CreateRemoteciModal from "./CreateRemoteciModal";
import EditRemoteciModal from "./EditRemoteciModal";
import type { Filters, IRemoteci, IRemoteciWithApiSecret } from "types";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  type IAction,
  ExpandableRowContent,
} from "@patternfly/react-table";
import { useLocation, useNavigate } from "react-router";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "services/filters";
import {
  useCreateRemoteciMutation,
  useDeactivateRemoteciMutation,
  useListRemotecisQuery,
  useReactivateRemoteciMutation,
  useRefreshRemoteciApiSecretMutation,
} from "./remotecisApi";
import { fromNow } from "services/date";
import LoadingPageSection from "ui/LoadingPageSection";
import { useAuth } from "auth/authSelectors";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import NewApiSecret from "./NewApiSecret";

function RemotecisList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, { state: null }),
  );
  const { currentUser } = useAuth();
  const [inputSearch, setInputSearch] = useState(filters.name || "");

  const [remoteciWithApiSecret, setRemoteciWithApiSecret] =
    useState<IRemoteciWithApiSecret | null>(null);
  const [remoteciToEdit, setRemoteciToEdit] = useState<IRemoteci | null>(null);
  const [createRemoteci, { isLoading: isCreating }] =
    useCreateRemoteciMutation();

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/remotecis${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading, isFetching } = useListRemotecisQuery(filters);

  const [reactivateRemoteci] = useReactivateRemoteciMutation();
  const [deactivateRemoteci] = useDeactivateRemoteciMutation();
  const [refreshRemoteciApi] = useRefreshRemoteciApiSecretMutation();

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
    const actions: IAction[] = [
      {
        title: "Edit remoteci",
        onClick: () => setRemoteciToEdit(remoteci),
      },
      {
        title: "Regenerate API Secret",
        onClick: () =>
          refreshRemoteciApi(remoteci).then((r) =>
            setRemoteciWithApiSecret(r.data?.remoteci || null),
          ),
      },
    ];
    if (remoteci.state === "active") {
      actions.push({
        isSeparator: true,
      });
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
      <div className="pf-v6-u-mb-lg">
        <CreateRemoteciModal
          onSubmit={(remoteci) =>
            createRemoteci({
              ...remoteci,
              team_id: currentUser?.team?.id,
            }).then((r) => setRemoteciWithApiSecret(r.data || null))
          }
          isDisabled={isCreating}
        />
      </div>
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
      <EditRemoteciModal
        remoteci={remoteciToEdit}
        onClose={() => {
          setRemoteciToEdit(null);
        }}
      />
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
              <Th>Created</Th>
              <Th className="text-center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.remotecis.map((remoteci) => {
              const remoteciActions = buildRemoteciActions(remoteci);
              return (
                <Fragment key={`${remoteci.id}.${remoteci.etag}`}>
                  <Tr isContentExpanded>
                    <Td>
                      <span>
                        <CopyIconButton
                          text={remoteci.id}
                          textOnSuccess="copied"
                          className="pf-v6-u-mr-xs pointer"
                        />
                        {remoteci.id}
                      </span>
                    </Td>
                    <Td>{remoteci.name}</Td>
                    <Td className="text-center">
                      {remoteci.state === "active" ? (
                        <Label color="green">active</Label>
                      ) : (
                        <Label color="red">inactive</Label>
                      )}
                    </Td>
                    <Td>{fromNow(remoteci.created_at)}</Td>
                    <Td className="text-center">
                      <ActionsColumn items={remoteciActions} />
                    </Td>
                  </Tr>
                  {remoteciWithApiSecret !== null &&
                    remoteciWithApiSecret.id === remoteci.id && (
                      <Tr isExpanded>
                        <Td colSpan={6}>
                          <ExpandableRowContent>
                            <NewApiSecret remoteci={remoteciWithApiSecret} />
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    )}
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      )}
    </div>
  );
}

export default function RemotecisPage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Remotecis" }]} />
      <Content component="h1">Remotecis</Content>
      <Content component="p">
        A remoteci defines how your infrastructure connects to DCI, whether
        through the{" "}
        <a
          href="https://docs.distributed-ci.io/python-dciclient/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CLI
        </a>
        ,{" "}
        <a
          href="https://docs.distributed-ci.io/dci-downloader/"
          target="_blank"
          rel="noopener noreferrer"
        >
          DCI Downloader
        </a>
        , or Ansible Agents.
        <br />
        For better isolation, create one remoteci per jumphost.
      </Content>
      {currentUser.team === null ? (
        <EmptyState title="To create a remoteci, you need to be on a team. Please contact a DCI Administrator or your EPM." />
      ) : (
        <RemotecisList />
      )}
    </PageSection>
  );
}
