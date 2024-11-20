import { useEffect, useState } from "react";
import MainPage from "pages/MainPage";
import {
  Card,
  Gallery,
  GalleryItem,
  CardBody,
  Content,
  ContentVariants,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb } from "ui";
import { useLocation, useNavigate } from "react-router-dom";
import { groupTopicsPerProduct, sortTopicWithSemver } from "./topicsActions";
import CreateTopicModal from "./CreateTopicModal";
import { getProductIcon } from "ui/icons";
import { Filters } from "types";
import { createSearchFromFilters, parseFiltersFromSearch } from "api/filters";
import { useCreateTopicMutation, useListTopicsQuery } from "./topicsApi";
import { useListProductsQuery } from "products/productsApi";
import { useAuth } from "auth/authSelectors";

export default function TopicsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters] = useState<Filters>(
    parseFiltersFromSearch(location.search, { limit: 100 }),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/topics${newSearch}`, { replace: true });
  }, [navigate, filters]);
  const { currentUser } = useAuth();
  const { data, isLoading } = useListTopicsQuery(filters);
  const { data: dataProducts, isLoading: isLoadingProducts } =
    useListProductsQuery();

  const [createTopic, { isLoading: isCreating }] = useCreateTopicMutation();

  if (!data || !dataProducts || currentUser === null) return null;

  const topicsPerProduct = groupTopicsPerProduct(
    data.topics,
    dataProducts.products,
  );

  return (
    <MainPage
      title="Topics"
      description="Click on the topic that interests you to see its components."
      loading={isLoading && isLoadingProducts}
      empty={data.topics.length === 0}
      HeaderButton={
        currentUser.isSuperAdmin ? (
          <CreateTopicModal
            products={dataProducts.products}
            onSubmit={createTopic}
            isDisabled={isCreating}
          />
        ) : null
      }
      EmptyComponent={
        <EmptyState title="There is no topics" info="See documentation" />
      }
      Breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Topics" }]} />
      }
    >
      {topicsPerProduct.map((product) => {
        const ProductIcon = getProductIcon(product.name);
        return (
          <div key={product.id} className="pf-v6-u-mb-xl">
            <Content component={ContentVariants.h2}>
              <ProductIcon className="pf-v6-u-mr-sm" />
              {product.name}
            </Content>
            <Gallery hasGutter key={product.id}>
              {product.topics.sort(sortTopicWithSemver).map((topic) => (
                <GalleryItem key={topic.id}>
                  <Card
                    onClick={() => navigate(`/topics/${topic.id}/components`)}
                    title="Click to see components"
                    className="pointer"
                  >
                    <CardBody>
                      <Content component={ContentVariants.h4}>
                        {topic.name}
                      </Content>
                      <Content component={ContentVariants.p}>
                        {topic.id}
                      </Content>
                    </CardBody>
                  </Card>
                </GalleryItem>
              ))}
            </Gallery>
          </div>
        );
      })}
    </MainPage>
  );
}
