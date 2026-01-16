import { useEffect, useState } from "react";
import { EmptyState, Breadcrumb } from "ui";
import {
  Button,
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
import type { Filters, ITopic } from "types";
import { useLocation, useNavigate } from "react-router";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "services/filters";

import LoadingPageSection from "ui/LoadingPageSection";
import { useAuth } from "auth/authSelectors";
import { useListTopicsQuery } from "topics/topicsApi";
import { useListProductsQuery } from "products/productsApi";
import { groupTopicsPerProduct } from "topics/topicsActions";
import TopicsAdminTable from "./TopicsAdminTable";
import CreateTopicModal from "./CreateTopicModal";
import EditTopicModal from "./EditTopicModal";
import useModal from "hooks/useModal";

function TopicsList({ onEdit }: { onEdit: (topic: ITopic) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, { state: null }),
  );
  const [inputSearch, setInputSearch] = useState(filters.name || "");

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/admin/topics${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading, isFetching } = useListTopicsQuery(filters);
  const { data: dataProducts, isLoading: isLoadingProducts } =
    useListProductsQuery();

  const setFiltersAndResetPagination = (f: Partial<Filters>) => {
    setFilters({
      ...filters,
      ...f,
      offset: 0,
    });
  };

  if (isLoading || isLoadingProducts) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return <EmptyState title="There is no topics" />;
  }

  const topicsCount = data._meta.count;
  const topicsPerProduct = groupTopicsPerProduct(
    data.topics,
    dataProducts?.products || [],
  );

  return (
    <div>
      <Toolbar id="toolbar-topics" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Search a topic"
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
              {topicsCount === 0 ? null : (
                <Pagination
                  perPage={filters.limit}
                  page={offsetAndLimitToPage(filters.offset, filters.limit)}
                  itemCount={topicsCount}
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
      ) : data.topics.length === 0 ? (
        inputSearch === "" ? (
          <EmptyState
            title="There is no topics"
            info="Do you want to create one?"
          />
        ) : (
          <EmptyState
            title="There is no topics"
            info="There is no topics matching your search. Please update your search."
          />
        )
      ) : (
        <TopicsAdminTable topicsPerProduct={topicsPerProduct} onEdit={onEdit} />
      )}
    </div>
  );
}

export default function AdminTopicsPage() {
  const { currentUser } = useAuth();
  const createModal = useModal(false);
  const editModal = useModal(false);
  const [topicToEdit, setTopicToEdit] = useState<ITopic | null>(null);

  if (!currentUser) return null;

  const handleEdit = (topic: ITopic) => {
    setTopicToEdit(topic);
    editModal.show();
  };

  return (
    <>
      <CreateTopicModal
        isOpen={createModal.isOpen}
        onClose={createModal.hide}
      />

      {topicToEdit && (
        <EditTopicModal
          topic={topicToEdit}
          isOpen={editModal.isOpen}
          onClose={editModal.hide}
        />
      )}

      <PageSection>
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Admin Topics" }]}
        />
        <Content component="h1">Topics</Content>
        <div className="pf-v6-u-mb-md">
          <Button variant="primary" onClick={createModal.show}>
            Create a new topic
          </Button>
        </div>
        <TopicsList onEdit={handleEdit} />
      </PageSection>
    </>
  );
}
